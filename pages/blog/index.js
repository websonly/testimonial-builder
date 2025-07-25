import Link from 'next/link'
import { getAllPosts } from '../../lib/posts'

export default function BlogIndex({ posts }) {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <ul className="space-y-6">
      {posts.map(({ slug, title, description, date }) => (
          <li key={slug}>
            <Link href={`/blog/${slug}`}>
              <a className="block group">
                <h2>{title}</h2>
                <p>{date}</p>
                <p>{description}</p>
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
