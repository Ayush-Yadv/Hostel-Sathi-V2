import { MetadataRoute } from 'next'

const locations = [
  'Knowledge Park',
  'Galgotia College',
  'GL Bajaj',
  'GNIOT',
  'NIET College',
  'IIMT College',
  'Knowledge Park 1',
  'Knowledge Park 2',
  'Knowledge Park 3',
  'Alpha 1',
  'Alpha 2',
  'Beta 1',
  'Beta 2',
  'Gamma 1',
  'Gamma 2',
  'Delta 1',
  'Pari Chowk',
  'Jagat Farm',
  'Surajpur'
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://hostelsathi.com'

  // Base pages
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hostels`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ] as MetadataRoute.Sitemap

  // Add location-specific pages
  locations.forEach((location) => {
    routes.push({
      url: `${baseUrl}/hostels/near/${location.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  })

  // Add type-specific pages
  const types = ['boys', 'girls', 'pg', 'hostel']
  types.forEach((type) => {
    routes.push({
      url: `${baseUrl}/hostels/${type}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    })
  })

  // Add combination pages (type + location)
  types.forEach((type) => {
    locations.forEach((location) => {
      routes.push({
        url: `${baseUrl}/hostels/${type}/near/${location.toLowerCase().replace(/\s+/g, '-')}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    })
  })

  return routes
} 