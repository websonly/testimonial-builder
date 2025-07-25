import Link from 'next/link'
import { getAllPosts } from '../../lib/posts'

export default function BlogIndex({ posts }) {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <ul className="space-y-6">
        {posts.map(({ slug, metadata }) => (
          <li key={slug}>
            <Link href={`/blog/${slug}`}>
              <a className="block group">
                <h2 className="text-2xl font-semibold group-hover:underline">{metadata.title}</h2>
                <p className="text-gray-500 text-sm">{metadata.date}</p>
                <p className="text-gray-700 mt-2">{metadata.description}</p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
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
