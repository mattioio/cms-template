import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Badge } from '@/components/ui/badge'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    depth: 1,
  })

  const post = result.docs[0]
  if (!post) return { title: 'Post Not Found' }

  return {
    title: post.title,
    description: post.excerpt || undefined,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    select: { slug: true },
    limit: 1000,
  })
  return posts.docs.map((post) => ({ slug: post.slug }))
}

export const revalidate = 60

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    depth: 2,
  })

  const post = result.docs[0]
  if (!post) notFound()

  const featuredImage =
    post.featuredImage && typeof post.featuredImage === 'object' ? post.featuredImage : null
  const categories = Array.isArray(post.categories)
    ? post.categories.filter((c) => typeof c === 'object')
    : []
  const author = post.author && typeof post.author === 'object' ? post.author : null

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        {categories.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {categories.map((cat: { id: string; name: string }) => (
              <Badge key={cat.id} variant="secondary">
                {cat.name}
              </Badge>
            ))}
          </div>
        )}
        <h1 className="mb-4 text-4xl font-bold leading-tight">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {author?.name && <span>By {author.name}</span>}
          {publishedDate && <span>{publishedDate}</span>}
        </div>
      </header>

      {featuredImage?.url && (
        <div className="relative mb-8 aspect-video overflow-hidden rounded-lg">
          <Image
            src={featuredImage.url}
            alt={featuredImage.alt || post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none">
        <RichText data={post.content} />
      </div>
    </article>
  )
}
