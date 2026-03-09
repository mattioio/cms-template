import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Button } from '@/components/ui/button'

export async function Header() {
  const payload = await getPayload({ config: configPromise })

  const [siteSettings, navigation] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings' }).catch(() => null),
    payload.findGlobal({ slug: 'navigation' }).catch(() => null),
  ])

  const siteName = siteSettings?.siteName || 'My Site'
  const links = navigation?.links || []

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary">
          {siteName}
        </Link>

        <nav className="flex items-center gap-6">
          {links.map((link: { label: string; url: string }, i: number) => (
            <Link
              key={i}
              href={link.url}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              Blog
            </Button>
          </Link>
          <Link href="/properties">
            <Button variant="ghost" size="sm">
              Properties
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
