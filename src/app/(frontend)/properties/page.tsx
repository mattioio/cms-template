import type { Metadata } from 'next'
import type { Where } from 'payload'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PropertyCard } from '@/components/PropertyCard'

export const metadata: Metadata = {
  title: 'Properties',
}

export const revalidate = 60

type Props = {
  searchParams: Promise<{ type?: string }>
}

export default async function PropertiesPage({ searchParams }: Props) {
  const { type } = await searchParams
  const payload = await getPayload({ config: configPromise })

  const whereClause: Where = {
    status: { equals: 'published' },
  }

  if (type === 'sale' || type === 'rent') {
    whereClause.propertyType = { equals: type }
  }

  const properties = await payload.find({
    collection: 'properties',
    where: whereClause,
    depth: 2,
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-4xl font-bold">Properties</h1>

        {/* Filter tabs */}
        <div className="flex gap-2">
          <a
            href="/properties"
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              !type
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All
          </a>
          <a
            href="/properties?type=sale"
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              type === 'sale'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            For Sale
          </a>
          <a
            href="/properties?type=rent"
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              type === 'rent'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            For Rent
          </a>
        </div>
      </div>

      {properties.docs.length === 0 ? (
        <p className="text-muted-foreground">No properties found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.docs.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}
