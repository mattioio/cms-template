import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Badge } from '@/components/ui/badge'
import type { Media } from '@/payload-types'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'properties',
    where: { slug: { equals: slug } },
    depth: 1,
  })

  const property = result.docs[0]
  if (!property) return { title: 'Property Not Found' }

  return { title: property.title }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const properties = await payload.find({
    collection: 'properties',
    where: { status: { equals: 'published' } },
    select: { slug: true },
    limit: 1000,
  })
  return properties.docs.map((p) => ({ slug: p.slug }))
}

export const revalidate = 60

function formatPrice(price: number, type: string) {
  const formatted = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(price)
  return type === 'rent' ? `${formatted}/month` : formatted
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'properties',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    depth: 2,
  })

  const property = result.docs[0]
  if (!property) notFound()

  const images: Media[] =
    property.images
      ?.map((item: { image: string | Media; id?: string | null }) =>
        typeof item.image === 'object' ? (item.image as Media) : null,
      )
      .filter((img): img is Media => img !== null) || []

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* Image gallery */}
      {images.length > 0 && (
        <div className="mb-8 grid gap-4">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={images[0]!.url!}
              alt={images[0]!.alt || property.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-3 gap-4">
              {images.slice(1, 4).map((img: Media, i: number) => (
                <div key={i} className="relative aspect-video overflow-hidden rounded-lg">
                  <Image src={img.url!} alt={img.alt || ''} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-1 text-3xl font-bold">{property.title}</h1>
          <p className="text-muted-foreground">{property.location}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary">
            {formatPrice(property.price, property.propertyType)}
          </p>
          <Badge
            variant={property.propertyType === 'sale' ? 'default' : 'secondary'}
            className="mt-1"
          >
            {property.propertyType === 'sale' ? 'For Sale' : 'For Rent'}
          </Badge>
        </div>
      </div>

      {/* Details bar */}
      <div className="mb-8 flex gap-6 rounded-lg border bg-muted/50 p-4">
        {property.bedrooms != null && (
          <div>
            <p className="text-2xl font-semibold">{property.bedrooms}</p>
            <p className="text-sm text-muted-foreground">
              Bedroom{property.bedrooms !== 1 ? 's' : ''}
            </p>
          </div>
        )}
        {property.bathrooms != null && (
          <div>
            <p className="text-2xl font-semibold">{property.bathrooms}</p>
            <p className="text-sm text-muted-foreground">
              Bathroom{property.bathrooms !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="prose prose-lg max-w-none">
        <RichText data={property.description} />
      </div>
    </div>
  )
}
