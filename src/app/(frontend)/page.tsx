import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PostCard } from '@/components/PostCard'
import { PropertyCard } from '@/components/PropertyCard'
import { Button } from '@/components/ui/button'

export const revalidate = 60

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const [siteSettings, posts, properties, propertiesCount, postsCount] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings' }).catch(() => null),
    payload
      .find({
        collection: 'posts',
        where: { status: { equals: 'published' } },
        limit: 3,
        sort: '-publishedAt',
        depth: 2,
      })
      .catch(() => ({ docs: [] })),
    payload
      .find({
        collection: 'properties',
        where: { status: { equals: 'published' } },
        limit: 3,
        depth: 2,
      })
      .catch(() => ({ docs: [] })),
    payload
      .count({ collection: 'properties', where: { status: { equals: 'published' } } })
      .catch(() => ({ totalDocs: 0 })),
    payload
      .count({ collection: 'posts', where: { status: { equals: 'published' } } })
      .catch(() => ({ totalDocs: 0 })),
  ])

  const siteName = siteSettings?.siteName || 'My Site'
  const siteDescription =
    siteSettings?.siteDescription ||
    'Discover beautiful homes and inspiring stories about the art of living well.'

  // Pull hero image from the first published property
  const firstProperty = properties.docs[0]
  const firstImage = firstProperty?.images?.[0]?.image
  const heroFilename = typeof firstImage === 'object' && firstImage !== null ? (firstImage as { filename?: string }).filename : null
  const heroImageUrl = heroFilename ? `/api/media/file/${heroFilename}` : null

  const propertyCount = propertiesCount.totalDocs
  const postCount = postsCount.totalDocs

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[88vh] overflow-hidden">

        {/* Left: dark editorial panel */}
        <div
          className="relative z-10 flex w-full flex-col justify-between px-8 py-14 sm:w-[56%] lg:px-16 xl:px-20"
          style={{ background: '#0C0C0A' }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <span className="block h-px w-8" style={{ background: '#B8965A' }} />
            <span
              className="text-xs font-medium uppercase tracking-[0.3em]"
              style={{ color: '#B8965A' }}
            >
              Homes &amp; Stories
            </span>
          </div>

          {/* Headline + body + CTA */}
          <div className="my-auto py-10">
            <h1
              className="mb-7 leading-[1.04] tracking-tight"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.2rem, 6.5vw, 5.5rem)',
                fontWeight: 300,
                color: '#F4EFE6',
              }}
            >
              {siteName.split(' ').length > 1 ? (
                <>
                  {siteName.split(' ').slice(0, -1).join(' ')}&nbsp;
                  <em style={{ fontStyle: 'italic' }}>{siteName.split(' ').slice(-1)}</em>
                </>
              ) : (
                <em style={{ fontStyle: 'italic' }}>{siteName}</em>
              )}
            </h1>

            <p
              className="mb-10 max-w-sm text-base leading-relaxed"
              style={{ color: '#8A8778', fontFamily: 'var(--font-sans)' }}
            >
              {siteDescription}
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                href="/properties"
                className="inline-flex items-center px-7 py-3.5 text-sm font-medium transition-opacity hover:opacity-85"
                style={{
                  background: '#B8965A',
                  color: '#0C0C0A',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '0.02em',
                }}
              >
                Explore Properties
              </Link>
              <Link
                href="/blog"
                className="group flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: '#F4EFE6', fontFamily: 'var(--font-sans)' }}
              >
                Read the Blog
                <span
                  className="transition-transform group-hover:translate-x-1"
                  style={{ color: '#B8965A' }}
                >
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Bottom stat strip */}
          <div
            className="flex items-center gap-8 border-t pt-6"
            style={{ borderColor: '#1E1E1C' }}
          >
            {propertyCount > 0 && (
              <div>
                <div
                  className="text-3xl font-light leading-none"
                  style={{ fontFamily: 'var(--font-display)', color: '#F4EFE6' }}
                >
                  {propertyCount}
                </div>
                <div
                  className="mt-1 text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: '#8A8778' }}
                >
                  Properties
                </div>
              </div>
            )}
            {propertyCount > 0 && postCount > 0 && (
              <div className="h-8 w-px" style={{ background: '#1E1E1C' }} />
            )}
            {postCount > 0 && (
              <div>
                <div
                  className="text-3xl font-light leading-none"
                  style={{ fontFamily: 'var(--font-display)', color: '#F4EFE6' }}
                >
                  {postCount}
                </div>
                <div
                  className="mt-1 text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: '#8A8778' }}
                >
                  Articles
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: full-bleed image */}
        <div className="absolute inset-y-0 right-0 hidden w-[44%] md:block">
          {heroImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImageUrl}
              alt="Featured property"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full" style={{ background: '#1A1A18' }} />
          )}
          {/* Blend edge into dark panel */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-20"
            style={{ background: 'linear-gradient(to right, #0C0C0A, transparent)' }}
          />
        </div>

      </section>

      {/* Latest Posts */}
      {posts.docs.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold">Latest Posts</h2>
              <Link href="/blog">
                <Button variant="ghost">View all &rarr;</Button>
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.docs.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Properties */}
      {properties.docs.length > 0 && (
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold">Latest Properties</h2>
              <Link href="/properties">
                <Button variant="ghost">View all &rarr;</Button>
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.docs.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
