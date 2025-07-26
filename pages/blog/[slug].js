import { getPostBySlug, getPostSlugs } from '../../lib/posts'
import Head from 'next/head'

export default function Post({ post }) {
  return (
    <>
      <Head>
        <title>{post.title} | Blog</title>
        <meta name="description" content={post.description || ''} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description || ''} />
        <meta property="og:type" content="article" />
      </Head>

      <main className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500 text-sm mb-8">{post.date}</p>
        <article
          className="prose prose-lg"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </main>
    </>
  )
}

export async function getStaticPaths() {
  const slugs = getPostSlugs()

  return {
    paths: slugs.map((slug) => ({
      params: { slug: slug.replace(/\.md$/, '') },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug)

  return {
    props: {
      post,
    },
  }
}
