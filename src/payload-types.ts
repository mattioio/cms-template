/**
 * This file was auto-generated — stub version.
 * Run `pnpm generate:types` after connecting your DATABASE_URL to regenerate.
 */

import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

// Registers our types with the Payload local API so queries return typed results
declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}

export interface Config {
  collections: {
    users: User
    media: Media
    categories: Category
    posts: Post
    properties: Property
  }
  globals: {
    'site-settings': SiteSettings
    navigation: Navigation
  }
}

export interface User {
  id: string
  name?: string | null
  updatedAt: string
  createdAt: string
  email: string
  resetPasswordToken?: string | null
  resetPasswordExpiration?: string | null
  salt?: string | null
  hash?: string | null
  loginAttempts?: number | null
  lockUntil?: string | null
  password?: string | null
}

export interface Media {
  id: string
  alt: string
  updatedAt: string
  createdAt: string
  url?: string | null
  thumbnailURL?: string | null
  filename?: string | null
  mimeType?: string | null
  filesize?: number | null
  width?: number | null
  height?: number | null
  focalX?: number | null
  focalY?: number | null
}

export interface Category {
  id: string
  name: string
  slug: string
  updatedAt: string
  createdAt: string
}

export interface Post {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published'
  publishedAt?: string | null
  excerpt?: string | null
  featuredImage?: (string | null) | Media
  content: SerializedEditorState
  categories?: (string | Category)[] | null
  author?: (string | null) | User
  updatedAt: string
  createdAt: string
  _status?: ('draft' | 'published') | null
}

export interface Property {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published'
  propertyType: 'sale' | 'rent'
  price: number
  location: string
  bedrooms?: number | null
  bathrooms?: number | null
  images?: {
    image: string | Media
    id?: string | null
  }[]
  description: SerializedEditorState
  updatedAt: string
  createdAt: string
  _status?: ('draft' | 'published') | null
}

export interface SiteSettings {
  id: string
  siteName: string
  siteDescription?: string | null
  logo?: (string | null) | Media
  socialLinks?: {
    twitter?: string | null
    instagram?: string | null
    facebook?: string | null
    linkedin?: string | null
  }
  updatedAt: string
  createdAt: string
  globalType?: string | null
}

export interface Navigation {
  id: string
  links?: {
    label: string
    url: string
    id?: string | null
  }[]
  updatedAt: string
  createdAt: string
  globalType?: string | null
}
