import { getPostBySlug, getPostSlugs } from '../../lib/posts';
import { remark } from 'remark';
import html from 'remark-html';
import Head from 'next/head';

export default function Post({ post }) {
  return (
    <>
      <Head>
        <title>{post.metadata.title} | Blog</title>
        <meta name="description" content={post.metadata.description || ''} />
        <meta property="og:title" content={post.metadata.title} />
        <meta property="og:description" content={post.metadata.description || ''} />
        <meta property="og:type" content="article" />
      </Head>

      <main className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-4">{post.metadata.title}</h1>
        <p className="text-gray-500 text-sm mb-8">{post.metadata.date}</p>
        <article
          className="prose prose-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </main>
    </>
  )
}


export async function getStaticPaths() {
  const slugs = getPostSlugs();

  return {
    paths: slugs.map((slug) => ({
      params: { slug: slug.replace(/\.md$/, '') },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);

  const processedContent = await remark()
    .use(html)
    .process(post.content);

  return {
    props: {
      post: {
        ...post,
        content: processedContent.toString(),
      },
    },
  };
}
