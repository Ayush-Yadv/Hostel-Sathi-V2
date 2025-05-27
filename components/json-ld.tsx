export default function JsonLd({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Hostel Sathi Greater Noida",
  description: "Your trusted platform for finding safe and comfortable hostel accommodation in Greater Noida",
  url: "https://hostelsathi.com",
  logo: "https://hostelsathi.com/logo.png",
  sameAs: [
    "https://facebook.com/hostelsathi",
    "https://twitter.com/hostelsathi",
    "https://instagram.com/hostelsathi",
    "https://linkedin.com/company/hostelsathi"
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "India",
    addressRegion: "Uttar Pradesh",
    addressLocality: "Greater Noida",
    postalCode: "201310",
    streetAddress: "Knowledge Park"
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-XXXXXXXXXX",
    contactType: "customer service",
    availableLanguage: ["en", "hi"]
  },
  areaServed: {
    "@type": "City",
    name: "Greater Noida",
    containsPlace: [
      {
        "@type": "Place",
        name: "Knowledge Park"
      },
      {
        "@type": "Place",
        name: "Galgotia College"
      },
      {
        "@type": "Place",
        name: "GL Bajaj"
      },
      {
        "@type": "Place",
        name: "GNIOT"
      }
    ]
  }
});

export const getHostelSchema = (hostel: any) => ({
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: hostel.name,
  description: hostel.description,
  url: `https://hostelsathi.com/hostels/${hostel.slug}`,
  image: hostel.images,
  address: {
    "@type": "PostalAddress",
    streetAddress: hostel.address.street,
    addressLocality: "Greater Noida",
    addressRegion: "Uttar Pradesh",
    addressCountry: "India",
    postalCode: hostel.address.postalCode
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: hostel.location.latitude,
    longitude: hostel.location.longitude
  },
  priceRange: hostel.priceRange,
  amenityFeature: hostel.amenities.map((amenity: string) => ({
    "@type": "LocationFeatureSpecification",
    name: amenity
  })),
  audience: {
    "@type": "Audience",
    audienceType: "Students"
  },
  areaServed: {
    "@type": "City",
    name: "Greater Noida"
  }
});

export const getLocationSchema = (location: string) => ({
  "@context": "https://schema.org",
  "@type": "Place",
  name: `${location} Area`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Greater Noida",
    addressRegion: "Uttar Pradesh",
    addressCountry: "India"
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "28.4744",
    longitude: "77.5040"
  },
  containsPlace: [
    {
      "@type": "LodgingBusiness",
      name: "Student Hostels and PGs",
      description: `Find verified hostels and PGs near ${location} in Greater Noida. Student accommodation with modern amenities.`
    }
  ]
});

// New function to generate BreadcrumbList schema
export const getBreadcrumbSchema = () => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://hostelsathi.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Team",
      "item": "https://hostelsathi.com/team"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Blog",
      "item": "https://hostelsathi.com/blogs"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Privacy Policy",
      "item": "https://hostelsathi.com/privacy"
    },
    {
      "@type": "ListItem",
      "position": 5,
      "name": "Hostels/PG",
      "item": "https://hostelsathi.com/hostels"
    }
  ]
});
