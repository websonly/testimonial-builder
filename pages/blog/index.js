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

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6">Bienvenido</h1>
      <p className="mb-4">Explora nuestros artículos y contenidos.</p>

      <Link href="/blog" className="text-blue-500 hover:underline">
        Ir al Blog →
      </Link>
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
