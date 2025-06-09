import { MetadataRoute } from 'next';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hostelsathi.com';
  const baseRoutes: MetadataRoute.Sitemap = [
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
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/saved-hostels`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/list-property`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // ... other base routes
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const hostelsRef = collection(db, 'hostels');
    const snapshot = await getDocs(hostelsRef);
    const locations = new Set<string>();

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.locationNormalized) {
        locations.add(data.locationNormalized);
      }
    });

    const types = ['hostel', 'pg', 'boys', 'girls'];
    locations.forEach((location) => {
      const formattedLocation = location.split(' ').join('-');
      types.forEach((type) => {
        dynamicRoutes.push({
          url: `${baseUrl}/hostels/${type}/near/${formattedLocation}`,
          lastModified: new Date(), // Consider using actual last modified date if available
          changeFrequency: 'daily',
          priority: 0.8,
        });
      });
    });
  } catch (error) {
    console.error('Error fetching hostels:', error);
  }

  return [...baseRoutes, ...dynamicRoutes];
}
