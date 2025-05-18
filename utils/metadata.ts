import { Metadata } from 'next'

const locationKeywords = [
  'hostels in Greater Noida',
  'PG in Greater Noida',
  'hostel near Galgotia College',
  'hostel near GL Bajaj',
  'hostel near Knowledge Park',
  'hostel near GNIOT',
  'hostel in Knowledge Park 1',
  'hostel in Knowledge Park 2',
  'hostel in Knowledge Park 3',
  'hostel near NIET College',
  'hostel near IIMT College',
  'boys hostel in Greater Noida',
  'girls hostel in Greater Noida',
  'student accommodation Greater Noida',
  'college hostels Greater Noida',
  'affordable hostels Greater Noida',
  'PG near Knowledge Park',
  'PG near Galgotia College',
  'PG near GL Bajaj',
  'student PG Greater Noida'
]

export const defaultMetadata: Metadata = {
  title: {
    default: 'Hostel Sathi - Find Hostels & PGs in Greater Noida',
    template: '%s | Hostel Sathi Greater Noida'
  },
  description: 'Find verified hostels and PGs near colleges in Greater Noida. We offer affordable accommodation near Galgotia College, GL Bajaj, Knowledge Park, GNIOT, and other institutions. Zero brokerage, student-friendly options.',
  keywords: [
    ...locationKeywords,
    'hostel booking',
    'student accommodation',
    'safe hostels',
    'affordable accommodation',
    'hostel finder',
    'Hostel Sathi',
    'zero brokerage hostels',
    'furnished PG rooms',
    'AC hostels Greater Noida',
    'student PG accommodation'
  ],
  authors: [{ name: 'Hostel Sathi Team' }],
  creator: 'Hostel Sathi',
  publisher: 'Hostel Sathi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://hostelsathi.com'),
  openGraph: {
    type: 'website',
    siteName: 'Hostel Sathi Greater Noida',
    title: 'Hostel Sathi - Find Hostels & PGs in Greater Noida',
    description: 'Discover verified hostels and PGs near colleges in Greater Noida. Best options near Galgotia College, GL Bajaj, Knowledge Park. Safe, affordable, zero brokerage accommodation for students.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Hostel Sathi - Your Trusted Hostel Finding Platform in Greater Noida'
      }
    ],
    locale: 'en_IN',
    countryName: 'India',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hostel Sathi - Find Hostels & PGs in Greater Noida',
    description: 'Looking for hostels near Galgotia College, GL Bajaj, or Knowledge Park? Find verified, affordable accommodation with Hostel Sathi. Zero brokerage, student-friendly options.',
    images: ['/twitter-image.jpg'],
    creator: '@hostelsathi',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://hostelsathi.com',
  },
  other: {
    'geo.region': 'IN-UP',
    'geo.placename': 'Greater Noida',
    'geo.position': '28.4744;77.5040',
    'ICBM': '28.4744, 77.5040'
  }
} as Metadata

export const generateHomeMetadata = (): Metadata => ({
  ...defaultMetadata,
  title: 'Hostel Sathi - Find Hostels & PGs near Colleges in Greater Noida',
  description: 'Discover affordable hostels and PGs near Galgotia College, GL Bajaj, Knowledge Park, and other colleges in Greater Noida. Verified listings, zero brokerage, student-friendly accommodation.',
  alternates: {
    canonical: 'https://hostelsathi.com',
  },
})

export const generateAboutMetadata = (): Metadata => ({
  ...defaultMetadata,
  title: 'About Hostel Sathi - Your Trusted Hostel Finding Platform in Greater Noida',
  description: 'Learn about Hostel Sathi\'s mission to provide safe and comfortable accommodation for students in Greater Noida. Find hostels near Galgotia College, GL Bajaj, Knowledge Park, and more.',
  alternates: {
    canonical: 'https://hostelsathi.com/about-us',
  },
  openGraph: {
    ...defaultMetadata.openGraph,
    title: 'About Hostel Sathi - Your Trusted Hostel Finding Platform in Greater Noida',
    description: 'Learn about Hostel Sathi\'s mission to provide safe and comfortable accommodation for students in Greater Noida. Find hostels near top colleges.',
  },
})

export const generateContactMetadata = (): Metadata => ({
  ...defaultMetadata,
  title: 'Contact Hostel Sathi - Find Hostels in Greater Noida',
  description: 'Need help finding hostels or PGs in Greater Noida? Contact Hostel Sathi for verified accommodation options near Galgotia College, GL Bajaj, Knowledge Park, and other locations.',
  alternates: {
    canonical: 'https://hostelsathi.com/contact-us',
  },
  openGraph: {
    ...defaultMetadata.openGraph,
    title: 'Contact Hostel Sathi - Find Hostels in Greater Noida',
    description: 'Need help finding hostels in Greater Noida? Contact us for verified accommodation near colleges. Zero brokerage, student-friendly options available.',
  },
})

export const generateLocationMetadata = (location: string): Metadata => ({
  ...defaultMetadata,
  title: `Hostels & PGs near ${location} - Hostel Sathi Greater Noida`,
  description: `Find verified hostels and PGs near ${location}. Affordable accommodation with zero brokerage. AC rooms, furnished options, and student-friendly environment available.`,
  keywords: [
    `hostel near ${location}`,
    `PG near ${location}`,
    `student accommodation near ${location}`,
    `boys hostel near ${location}`,
    `girls hostel near ${location}`,
    ...defaultMetadata.keywords as string[]
  ],
  alternates: {
    canonical: `https://hostelsathi.com/hostels/${location.toLowerCase().replace(/\s+/g, '-')}`,
  },
  openGraph: {
    ...defaultMetadata.openGraph,
    title: `Hostels & PGs near ${location} - Hostel Sathi Greater Noida`,
    description: `Looking for hostels or PGs near ${location}? Find verified, affordable accommodation with Hostel Sathi. Zero brokerage, student-friendly options available.`,
  },
}) 