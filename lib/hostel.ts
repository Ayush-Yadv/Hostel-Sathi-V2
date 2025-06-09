import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export interface Hostel {
  id: string;
  name: string;
  type: string;
  location: string;
  address: string;
  // Add other relevant fields
}

export async function getHostelsByTypeAndLocation(type: string, location: string): Promise<Hostel[]> {
  try {
    const hostelsRef = collection(db, 'hostels');
    const locationFormatted = location.split('-').join(' ').toLowerCase();
    
    // Create query based on type
    let q = query(hostelsRef);
    
    if (type === 'boys' || type === 'girls') {
      q = query(hostelsRef, 
        where('gender', '==', type === 'boys' ? 'male' : 'female'),
        where('locationNormalized', '==', locationFormatted)
      );
    } else if (type === 'pg') {
      q = query(hostelsRef,
        where('type', '==', 'pg'),
        where('locationNormalized', '==', locationFormatted)
      );
    } else {
      q = query(hostelsRef,
        where('type', '==', 'hostel'),
        where('locationNormalized', '==', locationFormatted)
      );
    }

    const querySnapshot = await getDocs(q);
    const hostels: Hostel[] = [];

    querySnapshot.forEach((doc) => {
      hostels.push({
        id: doc.id,
        ...doc.data()
      } as Hostel);
    });

    return hostels;
  } catch (error) {
    console.error('Error fetching hostels:', error);
    return [];
  }
} 