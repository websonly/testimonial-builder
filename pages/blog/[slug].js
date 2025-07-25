import { getAllPosts, getPostBySlug } from '../../lib/posts'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage({ params }) {
  const { slug } = params
  const { frontmatter, contentHtml } = await getPostBySlug(slug)

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-purple-700 mb-2">{frontmatter.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{frontmatter.date}</p>
      <article className="prose prose-purple max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </div>
  )
}
