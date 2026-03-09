import Link from 'next/link'
import Image from 'next/image'
import type { Property } from '@/payload-types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Props = {
  property: Property
}

function formatPrice(price: number, type: string) {
  const formatted = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(price)
  return type === 'rent' ? `${formatted}/mo` : formatted
}

export function PropertyCard({ property }: Props) {
  const firstImage =
    property.images?.[0]?.image && typeof property.images[0].image === 'object'
      ? property.images[0].image
      : null

  return (
    <Link href={`/properties/${property.slug}`} className="group block">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        {firstImage?.url && (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={firstImage.url}
              alt={firstImage.alt || property.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2 text-lg">{property.title}</CardTitle>
            <Badge variant={property.propertyType === 'sale' ? 'default' : 'secondary'}>
              {property.propertyType === 'sale' ? 'For Sale' : 'For Rent'}
            </Badge>
          </div>
          <p className="text-xl font-bold text-primary">
            {formatPrice(property.price, property.propertyType)}
          </p>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground">{property.location}</p>
        </CardContent>
        <CardFooter className="gap-4">
          {property.bedrooms != null && (
            <span className="text-sm text-muted-foreground">
              {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}
            </span>
          )}
          {property.bathrooms != null && (
            <span className="text-sm text-muted-foreground">
              {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
