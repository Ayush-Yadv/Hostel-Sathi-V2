import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getHostelsByTypeAndLocation } from '@/lib/hostel';

interface PageProps {
  params: {
    type: string;
    location: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type, location } = params;
  const formattedLocation = location.split('-').join(' ');
  const formattedType = type === 'hostel' ? 'Hostels' : 
                        type === 'pg' ? 'PG Accommodations' :
                        type === 'boys' ? 'Boys Hostels' :
                        type === 'girls' ? 'Girls Hostels' : 'Hostels';

  return {
    title: `${formattedType} near ${formattedLocation} | HostelSathi`,
    description: `Find the best ${formattedType.toLowerCase()} near ${formattedLocation}. Browse verified accommodations with photos, amenities, and reviews.`,
    openGraph: {
      title: `${formattedType} near ${formattedLocation} | HostelSathi`,
      description: `Find the best ${formattedType.toLowerCase()} near ${formattedLocation}. Browse verified accommodations with photos, amenities, and reviews.`,
    },
  };
}

export default async function HostelTypeLocationPage({ params }: PageProps) {
  const { type, location } = params;
  
  // Validate type parameter
  const validTypes = ['hostel', 'pg', 'boys', 'girls'];
  if (!validTypes.includes(type)) {
    notFound();
  }

  // Get hostels data
  const hostels = await getHostelsByTypeAndLocation(type, location);
  
  if (!hostels || hostels.length === 0) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {type.charAt(0).toUpperCase() + type.slice(1)} Accommodations near {location.split('-').join(' ')}
      </h1>
      {/* Add your hostel listing component here */}
    </div>
  );
} 