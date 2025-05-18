import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/private/',
        '/*.json$',
        '/dashboard/',
      ],
    },
    sitemap: 'https://hostelsathi.com/sitemap.xml',
  }
} 