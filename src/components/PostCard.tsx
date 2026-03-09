import Link from 'next/link'
import Image from 'next/image'
import type { Post, Category } from '@/payload-types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Props = {
  post: Post
}

export function PostCard({ post }: Props) {
  const featuredImage =
    post.featuredImage && typeof post.featuredImage === 'object' ? post.featuredImage : null

  const categories = Array.isArray(post.categories)
    ? post.categories.filter((c): c is Category => typeof c === 'object')
    : []

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        {featuredImage?.url && (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={featuredImage.url}
              alt={featuredImage.alt || post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <CardHeader className="pb-2">
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {categories.map((cat) => (
                <Badge key={cat.id} variant="secondary">
                  {cat.name}
                </Badge>
              ))}
            </div>
          )}
          <CardTitle className="line-clamp-2 text-lg">{post.title}</CardTitle>
        </CardHeader>
        {post.excerpt && (
          <CardContent className="pb-2">
            <p className="line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
          </CardContent>
        )}
        {publishedDate && (
          <CardFooter>
            <p className="text-xs text-muted-foreground">{publishedDate}</p>
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}
