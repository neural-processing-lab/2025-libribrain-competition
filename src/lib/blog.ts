import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import katex from 'katex';

export interface Citation {
  id: string;
  title: string;
  authors: string[];
  journal?: string;
  year: number;
  volume?: string;
  pages?: string;
  doi?: string;
  url?: string;
  bibtex: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  authors: string[];
  tags: string[];
  content: string;
  /** BibTeX for citing the post (or the paper behind it, see citationTarget). */
  selfCitation?: string;
  citationTarget?: 'blog' | 'paper';
  citations?: Citation[];
  /** Where the post was originally published, if it is cross-posted from elsewhere. */
  externalUrl?: string;
  externalSource?: string;
}

const postsDirectory = path.join(process.cwd(), 'content/blog');

// Empty on the custom domain (libribrain.com); "/2025-libribrain-competition" on the
// GitHub project-page deployment. Applied to blog asset URLs so images/videos resolve on both.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

function unescapeHtml(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

// Render `$$ ... $$` display math to static KaTeX HTML at build time. Inline `$...$` is
// deliberately left alone: older posts embed JS template literals that would false-match.
function renderDisplayMath(htmlContent: string): string {
  if (!htmlContent.includes('$$')) return htmlContent;
  const render = (tex: string) =>
    katex.renderToString(unescapeHtml(tex.trim()), { displayMode: true, throwOnError: false });
  return htmlContent
    // A paragraph that is nothing but a formula: drop the <p> wrapper (block inside <p> is invalid).
    .replace(/<p>\s*\$\$([\s\S]+?)\$\$\s*<\/p>/g, (_m, tex) => render(tex))
    .replace(/\$\$([\s\S]+?)\$\$/g, (_m, tex) => render(tex));
}

export async function getAllPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md') && f !== '_index.md');

  const posts = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // Process markdown
      const result = await remark()
        .use(remarkGfm)
        .use(html, { sanitize: false })
        .process(content);

      let htmlContent = result.toString();
      // Older posts came from Hugo with the project-page prefix baked into asset URLs;
      // normalise those to root-absolute first...
      htmlContent = htmlContent.replace(/(src|href)="\/2025-libribrain-competition\//g, '$1="/');
      // ...then apply the current deployment's basePath to every root-absolute URL, so
      // images/links resolve on both the custom domain (BASE_PATH="") and the GitHub
      // project page (BASE_PATH="/2025-libribrain-competition").
      if (BASE_PATH) {
        htmlContent = htmlContent.replace(/(src|href)="\/(?!\/)/g, `$1="${BASE_PATH}/`);
      }
      // Strip Hugo shortcodes
      htmlContent = htmlContent.replace(/\{\{[<>][^}]*\}\}/g, '');
      htmlContent = renderDisplayMath(htmlContent);

      return {
        slug,
        title: data.title || slug,
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
        description: data.description || data.excerpt || '',
        authors: data.authors || (data.author ? [data.author] : []),
        tags: data.tags || [],
        content: htmlContent,
        selfCitation: data.selfCitation || undefined,
        citationTarget: data.citationTarget === 'paper' ? 'paper' : data.selfCitation ? 'blog' : undefined,
        citations: Array.isArray(data.citations) && data.citations.length > 0 ? data.citations : undefined,
        externalUrl: data.externalUrl || undefined,
        externalSource: data.externalSource || undefined,
      } satisfies BlogPost;
    })
  );

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find(p => p.slug === slug) || null;
}
