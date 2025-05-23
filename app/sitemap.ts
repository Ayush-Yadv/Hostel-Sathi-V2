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
  const currentDate = new Date()

  // Base pages
  const routes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hostels`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/saved-hostels`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/list-property`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ] as MetadataRoute.Sitemap

  // Add location-specific pages
  locations.forEach((location) => {
    routes.push({
      url: `${baseUrl}/hostels/near/${location.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  })

  // Add type-specific pages
  const types = ['boys', 'girls', 'pg', 'hostel']
  types.forEach((type) => {
    routes.push({
      url: `${baseUrl}/hostels/${type}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    })
  })

  // Add combination pages (type + location)
  types.forEach((type) => {
    locations.forEach((location) => {
      routes.push({
        url: `${baseUrl}/hostels/${type}/near/${location.toLowerCase().replace(/\s+/g, '-')}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    })
  })

  return routes
} 
