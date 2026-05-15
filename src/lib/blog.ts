import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  authors: string[];
  tags: string[];
  content: string;
}

const postsDirectory = path.join(process.cwd(), 'content/blog');

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

      // Fix image paths - remove Hugo base path prefix
      let htmlContent = result.toString();
      htmlContent = htmlContent.replace(/src="\/2025-libribrain-competition\//g, 'src="/');
      // Strip Hugo shortcodes
      htmlContent = htmlContent.replace(/\{\{[<>][^}]*\}\}/g, '');

      return {
        slug,
        title: data.title || slug,
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
        description: data.description || '',
        authors: data.authors || [],
        tags: data.tags || [],
        content: htmlContent,
      };
    })
  );

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find(p => p.slug === slug) || null;
}
