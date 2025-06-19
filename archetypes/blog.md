---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
description: "Brief description of the post"
tags: ["announcement", "technical", "research"]
categories: ["blog"]
authors: ["Your Name"]
showDate: true
showAuthor: true
showReadingTime: true
showTableOfContents: true
showBreadcrumbs: true
showEdit: false
showPagination: true
showTaxonomies: true
math: true
---

Your blog post content goes here.

For math equations, you can use:
- Inline math: {{< math >}}f(x) = x^2{{< /math >}} or $f(x) = x^2$
- Display math: 
{{< displaymath >}}
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
{{< /displaymath >}}
or:
$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$

For citations, add at the end:

{{< bibtex id="yourpost2025" title="How to Cite This Post" >}}
@article{yourpost2025,
  title={Your Post Title},
  author={Your Name},
  journal={LibriBrain Competition Blog},
  year={2025},
  month={January},
  url={https://your-url.com},
  note={Blog post}
}
{{< /bibtex >}} 