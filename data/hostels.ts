export type HostelType = "hostel" | "pg"
export type GenderType = "boys" | "girls" | "co-ed"

export interface Hostel {
  id: number
  name: string
  price: number
  distance: {
    [key: string]: number
  }
  address: string
  description: string
  amenities: string[]
  images: string[]
  rating: number
  reviews: number
  type: HostelType
  gender: GenderType
}

export const hostelsList: Hostel[] = [
  {
    id: 1,
    name: "Sunrise Hostel",
    price: 8000,
    distance: {
      GCET: 0.5,
      NIET: 1.2,
      "G L BAJAJ": 0.8,
      GNIOT: 1.5,
      ABES: 2.0,
      KIET: 2.5,
      ITS: 1.8,
      BIMTECH: 3.0,
      "Sharda University": 2.2,
      Other: 1.5,
    },
    address: "123 College Road, Greater Noida",
    description:
      "Sunrise Hostel offers comfortable accommodation for students with all modern amenities. Located close to major colleges, it provides a conducive environment for studies.",
    amenities: ["WiFi", "AC Rooms", "Laundry", "Mess", "Power Backup", "Security"],
    images: Array(10).fill("/placeholder.svg?height=300&width=400"),
    rating: 4.5,
    reviews: 120,
    type: "hostel",
    gender: "boys",
  },
  {
    id: 2,
    name: "Royal PG",
    price: 7500,
    distance: {
      GCET: 0.8,
      NIET: 0.6,
      "G L BAJAJ": 1.2,
      GNIOT: 1.0,
      ABES: 1.8,
      KIET: 2.2,
      ITS: 1.5,
      BIMTECH: 2.8,
      "Sharda University": 2.0,
      Other: 1.3,
    },
    address: "45 Knowledge Park, Greater Noida",
    description:
      "Royal PG is a premium paying guest accommodation with spacious rooms and excellent facilities. It's ideal for students looking for a home away from home.",
    amenities: ["WiFi", "AC Rooms", "Gym", "Mess", "TV Lounge", "Security"],
    images: Array(10).fill("/placeholder.svg?height=300&width=400"),
    rating: 4.2,
    reviews: 85,
    type: "pg",
    gender: "co-ed",
  },
  {
    id: 3,
    name: "Student Haven",
    price: 6500,
    distance: {
      GCET: 1.0,
      NIET: 0.7,
      "G L BAJAJ": 0.5,
      GNIOT: 0.9,
      ABES: 1.5,
      KIET: 2.0,
      ITS: 1.2,
      BIMTECH: 2.5,
      "Sharda University": 1.8,
      Other: 1.2,
    },
    address: "78 Alpha Commercial Belt, Greater Noida",
    description:
      "Student Haven provides affordable accommodation with all necessary facilities. The hostel focuses on creating a friendly and supportive community for students.",
    amenities: ["WiFi", "Laundry", "Mess", "Study Room", "Power Backup", "Security"],
    images: Array(10).fill("/placeholder.svg?height=300&width=400"),
    rating: 4.0,
    reviews: 95,
    type: "hostel",
    gender: "girls",
  },
  {
    id: 4,
    name: "Campus Edge",
    price: 9000,
    distance: {
      GCET: 0.3,
      NIET: 1.0,
      "G L BAJAJ": 0.7,
      GNIOT: 1.2,
      ABES: 1.7,
      KIET: 2.3,
      ITS: 1.6,
      BIMTECH: 2.7,
      "Sharda University": 2.1,
      Other: 1.4,
    },
    address: "22 Beta-1, Greater Noida",
    description:
      "Campus Edge is a premium hostel located right next to major educational institutions. It offers luxurious rooms with all modern amenities for a comfortable stay.",
    amenities: ["WiFi", "AC Rooms", "Gym", "Swimming Pool", "Mess", "Laundry", "Security"],
    images: Array(10).fill("/placeholder.svg?height=300&width=400"),
    rating: 4.7,
    reviews: 150,
    type: "hostel",
    gender: "boys",
  },
  {
    id: 5,
    name: "Scholar's Nest",
    price: 7000,
    distance: {
      GCET: 0.9,
      NIET: 0.5,
      "G L BAJAJ": 1.0,
      GNIOT: 0.8,
      ABES: 1.6,
      KIET: 2.1,
      ITS: 1.4,
      BIMTECH: 2.6,
      "Sharda University": 1.9,
      Other: 1.3,
    },
    address: "56 Gamma-II, Greater Noida",
    description:
      "Scholar's Nest is designed specifically for students who prioritize academics. It provides a quiet and conducive environment for studies with all necessary facilities.",
    amenities: ["WiFi", "Study Rooms", "Library", "Mess", "Power Backup", "Security"],
    images: Array(10).fill("/placeholder.svg?height=300&width=400"),
    rating: 4.3,
    reviews: 110,
    type: "hostel",
    gender: "girls",
  },
  {
    id: 6,
    name: "Comfort Zone PG",
    price: 8500,
    distance: {
      GCET: 1.2,
      NIET: 0.9,
      "G L BAJAJ": 0.6,
      GNIOT: 1.1,
      ABES: 1.9,
      KIET: 2.4,
      ITS: 1.7,
      BIMTECH: 2.9,
      "Sharda University": 2.3,
      Other: 1.6,
    },
    address: "34 Chi-IV, Greater Noida",
    description:
      "Comfort Zone PG offers a homely environment with all modern amenities. The PG is known for its cleanliness, good food, and friendly staff.",
    amenities: ["WiFi", "AC Rooms", "Homely Food", "Laundry", "TV Lounge", "Security"],
    images: Array(10).fill("/placeholder.svg?height=300&width=400"),
    rating: 4.4,
    reviews: 130,
    type: "pg",
    gender: "girls",
  },
  {
    id: 7,
    name: "Green View Hostel",
    price: 7200,
    distance: {
      GCET: 1.1,
      NIET: 0.8,
      "G L BAJAJ": 0.9,
      GNIOT: 0.7,
      ABES: 1.4,
      KIET: 2.0,
      ITS: 1.3,
      BIMTECH: 2.4,
      "Sharda University": 1.7,
      Other: 1.2,
    },
    address: "89 Delta-I, Greater Noida",
    description:
      "Green View Hostel is surrounded by lush greenery, providing a refreshing environment for students. The hostel offers comfortable rooms and good facilities.",
    amenities: ["WiFi", "Garden", "Mess", "Laundry", "Power Backup", "Security"],
    images: Array(10).fill("/placeholder.svg?height=300&width=400"),
    rating: 4.1,
    reviews: 90,
    type: "hostel",
    gender: "co-ed",
  },
  {
    id: 8,
    name: "Tech Hub PG",
    price: 8800,
    distance: {
      GCET: 0.7,
      NIET: 0.4,
      "G L BAJAJ": 1.1,
      GNIOT: 0.6,
      ABES: 1.3,
      KIET: 1.9,
      ITS: 1.1,
      BIMTECH: 2.3,
      "Sharda University": 1.6,
      Other: 1.1,
    },
    address: "12 Omega-I, Greater Noida",
    description:
      "Tech Hub PG is designed for tech-savvy students with high-speed internet and modern amenities. It's located close to major tech institutions and offers a comfortable stay.",
    amenities: ["High-Speed WiFi", "AC Rooms", "Tech Lounge", "Mess", "Laundry", "Security"],
    images: Array(10).fill("/placeholder.svg?height=300&width=400"),
    rating: 4.6,
    reviews: 140,
    type: "pg",
    gender: "boys",
  },
  {
    id: 9,
    name: "Budget Stay",
    price: 6000,
    distance: {
      GCET: 1.3,
      NIET: 1.1,
      "G L BAJAJ": 0.8,
      GNIOT: 1.3,
      ABES: 2.1,
      KIET: 2.6,
      ITS: 1.9,
      BIMTECH: 3.1,
      "Sharda University": 2.5,
      Other: 1.8,
    },
    address: "67 Xu-III, Greater Noida",
    description:
      "Budget Stay offers affordable accommodation without compromising on essential facilities. It's perfect for students looking for a cost-effective option.",
    amenities: ["WiFi", "Mess", "Power Backup", "Security"],
    images: Array(10).fill("/placeholder.svg?height=300&width=400"),
    rating: 3.9,
    reviews: 75,
    type: "pg",
    gender: "co-ed",
  },
]

// Function to shuffle array (for random order of hostels)
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export const hostels = hostelsList
