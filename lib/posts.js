import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'))
}

export async function getPostBySlug(slug) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = path.join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  const { data, content } = matter(fileContents)
  const processedContent = await remark().use(html).process(content)
  const contentHtml = processedContent.toString()

  return {
    slug: realSlug,
    frontmatter: data,
    contentHtml,
  }
}

export async function getAllPosts() {
  const slugs = getPostSlugs()
  const posts = await Promise.all(slugs.map(getPostBySlug))
  return posts.sort((a, b) =>
    new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
  )
}
