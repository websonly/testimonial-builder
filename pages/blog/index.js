// pages/blog/index.js

import Link from 'next/link'
import { getAllPosts } from '../../lib/posts'

export default function BlogIndex({ posts }) {
  return (
    <main className="max-w-5xl mx-auto py-16 px-6">
      <h1 className="text-5xl font-bold mb-12 text-center text-purple-700">Blog</h1>

      <div className="space-y-12">
        {posts.map(({ slug, title, description, date }) => (
          <div key={slug} className="border-b pb-6">
            <Link href={`/blog/${slug}`}>
              <a className="block group transition-all duration-200">
                <h2 className="text-3xl font-semibold text-gray-900 group-hover:text-purple-600">
                  {title}
                </h2>
                <p className="text-sm text-gray-400 mt-1">{date}</p>
                <p className="text-gray-700 mt-2">{description}</p>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </main>
  )
}

export async function getStaticProps() {
  const posts = await getAllPosts()
  return {
    props: {
      posts
    }
  }
}
