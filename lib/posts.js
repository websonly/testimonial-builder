import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export async function getPostBySlug(slug) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    content: contentHtml,
    metadata: {
      title: data.title || '',
      description: data.description || '',
      date: data.date || ''
    }
  };
}

export async function getAllPosts() {
  const slugs = getPostSlugs();

  const posts = await Promise.all(
    slugs.map((slug) => getPostBySlug(slug.replace(/\.md$/, '')))
  );

  // Ordenar por fecha descendente
  return posts.sort((a, b) => new Date(b.metadata.date) - new Date(a.metadata.date));
}

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));
}
