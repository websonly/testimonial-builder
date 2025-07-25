import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-purple-700">Blog</h1>
      <div className="grid gap-6">
        {posts.map(({ slug, frontmatter }) => (
          <Link key={slug} href={`/blog/${slug}`}>
            <div className="p-6 rounded-xl border shadow hover:shadow-lg transition bg-white cursor-pointer">
              <h2 className="text-2xl font-semibold text-purple-600">{frontmatter.title}</h2>
              <p className="text-sm text-gray-500">{frontmatter.date}</p>
              <p className="mt-2 text-gray-700">{frontmatter.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
