export type HostelType = "hostel" | "pg"
export type GenderType = "boys" | "girls" 

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
    name: "RGHs",
    price: 11000,
    distance: {
      GCET: 0.5,
      NIET: 1.2,
      "G L BAJAJ": 0.8,
      GNIOT: 1.5,
      "Galgotia University": 2.0,
      KCC: 2.5,
      IIMT: 1.8,
      "Sharda University": 2.2,
      Other: 1.5,
    },
    address: "123 College Road, Greater Noida",
    description:
      "RGHs Hostel offers comfortable accommodation for students with all modern amenities. Located close to major colleges, it provides a conducive environment for studies.",
    amenities: ["WiFi", "AC Rooms", "Laundry", "Mess", "Power Backup", "Security"],
    images: [
      "/hostels/rghs/1.jpg",
      "/hostels/rghs/2.jpg",
      "/hostels/rghs/3.jpg",
      "/hostels/rghs/4.jpg",
      "/hostels/rghs/5.jpg",
      "/hostels/rghs/6.jpg",
      "/hostels/rghs/7.jpg",
      "/hostels/rghs/8.jpg",
    ],
    rating: 4.5,
    reviews: 120,
    type: "hostel",
    gender: "boys",
  },
  {
    id: 2,
    name: "RAHs",
    price: 12000,
    distance: {
      GCET: 0.8,
      NIET: 0.6,
      "G L BAJAJ": 1.2,
      GNIOT: 1.0,
      "Galgotia University": 1.8,
      KCC: 2.2,
      IIMT: 1.5,
      "Sharda University": 2.0,
      Other: 1.3,
    },
    address: "45 Knowledge Park, Greater Noida",
    description:
      "RAHs is a premium paying guest accommodation with spacious rooms and excellent facilities. It's ideal for students looking for a home away from home.",
    amenities: ["WiFi", "AC Rooms", "Gym", "Mess", "TV Lounge", "Security"],
    images: [
      "/hostels/rahs/1.jpg",
      "/hostels/rahs/2.webp",
      "/hostels/rahs/3.webp",
      "/hostels/rahs/4.webp"
    ],
    rating: 4.2,
    reviews: 85,
    type: "hostel",
    gender: "boys",
  },
  {
    id: 3,
    name: "SNHs",
    price: 11500,
    distance: {
      GCET: 1.0,
      NIET: 0.7,
      "G L BAJAJ": 0.5,
      GNIOT: 0.9,
      "Galgotia University": 1.5,
      KCC: 2.0,
      IIMT: 1.2,
      "Sharda University": 1.8,
      Other: 1.2,
    },
    address: "78 Alpha Commercial Belt, Greater Noida",
    description:
      "SNHs provides affordable accommodation with all necessary facilities. The hostel focuses on creating a friendly and supportive community for students.",
    amenities: ["WiFi", "Laundry", "Mess", "Study Room", "Power Backup", "Security"],
    images: [
      "/hostels/snhs/1.jpg",
      "/hostels/snhs/2.jpg",
      "/hostels/snhs/3.jpg",
      "/hostels/snhs/4.jpg",
      "/hostels/snhs/5.jpg",
      "/hostels/snhs/6.jpg",
      "/hostels/snhs/7.jpg"
    ],
    rating: 4.0,
    reviews: 95,
    type: "hostel",
    gender: "boys",
  },
  {
    id: 4,
    name: "WHTHs",
    price: 9000,
    distance: {
      GCET: 0.3,
      NIET: 1.0,
      "G L BAJAJ": 0.7,
      GNIOT: 1.2,
      "Galgotia University": 1.7,
      KCC: 2.3,
      IIMT: 1.6,
      "Sharda University": 2.1,
      Other: 1.4,
    },
    address: "22 Beta-1, Greater Noida",
    description:
      "WHTHs is a premium hostel located right next to major educational institutions. It offers luxurious rooms with all modern amenities for a comfortable stay.",
    amenities: ["WiFi", "AC Rooms", "Gym", "Swimming Pool", "Mess", "Laundry", "Security"],
    images: [
      "/hostels/whths/1.jpg",
      "/hostels/whths/2.jpg",
      "/hostels/whths/3.jpg",
      "/hostels/whths/4.jpg",
      "/hostels/whths/5.jpg"
    ],
    rating: 4.7,
    reviews: 150,
    type: "hostel",
    gender: "boys",
  },
  {
    id: 5,
    name: "RKHs",
    price: 12500,
    distance: {
      GCET: 0.9,
      NIET: 0.5,
      "G L BAJAJ": 1.0,
      GNIOT: 0.8,
      "Galgotia University": 1.6,
      KCC: 2.1,
      IIMT: 1.4,
      "Sharda University": 1.9,
      Other: 1.3,
    },
    address: "56 Gamma-II, Greater Noida",
    description:
      "RKHs is designed specifically for students who prioritize academics. It provides a quiet and conducive environment for studies with all necessary facilities.",
    amenities: ["WiFi", "Study Rooms", "Library", "Mess", "Power Backup", "Security"],
    images: [
      "/hostels/rkhs/1.jpg",
      "/hostels/rkhs/2.jpg",
      "/hostels/rkhs/3.jpg",
      "/hostels/rkhs/4.jpg",
      "/hostels/rkhs/5.jpg",
      "/hostels/rkhs/6.jpg",
      "/hostels/rkhs/7.jpg",
      "/hostels/rkhs/8.jpg",
      "/hostels/rkhs/9.jpg",
      "/hostels/rkhs/10.jpg"
    ],
    rating: 4.3,
    reviews: 110,
    type: "hostel",
    gender: "boys",
  },
  {
    id: 6,
    name: "BLUHs",
    price: 15000,
    distance: {
      GCET: 1.2,
      NIET: 0.9,
      "G L BAJAJ": 0.6,
      GNIOT: 1.1,
      "Galgotia University": 1.9,
      KCC: 2.4,
      IIMT: 1.7,
      "Sharda University": 2.3,
      Other: 1.6,
    },
    address: "34 Chi-IV, Greater Noida",
    description:
      "BLUHs Hostel offers a homely environment with all modern amenities. The hostel is known for its cleanliness, good food, and friendly staff.",
    amenities: ["WiFi", "AC Rooms", "Homely Food", "Laundry", "TV Lounge", "Security"],
    images: [
      "/hostels/bluhs/1.jpg",
      "/hostels/bluhs/2.jpg",
      "/hostels/bluhs/3.jpg",
      "/hostels/bluhs/4.jpg",
      "/hostels/bluhs/5.jpg",
      "/hostels/bluhs/6.jpg",
      "/hostels/bluhs/7.jpg",
      "/hostels/bluhs/8.jpg"
    ],
    rating: 4.4,
    reviews: 130,
    type: "hostel",
    gender: "girls",
  },
  {
    id: 7,
    name: "MAGHs",
    price: 14500,
    distance: {
      GCET: 1.1,
      NIET: 0.8,
      "G L BAJAJ": 0.9,
      GNIOT: 0.7,
      "Galgotia University": 1.4,
      KCC: 2.0,
      IIMT: 1.3,
      "Sharda University": 1.7,
      Other: 1.2,
    },
    address: "89 Delta-I, Greater Noida",
    description:
      "Green View Hostel is surrounded by lush greenery, providing a refreshing environment for students. The hostel offers comfortable rooms and good facilities.",
    amenities: ["WiFi", "Garden", "Mess", "Laundry", "Power Backup", "Security"],
    images: [
      "/hostels/maghs/1.jpg",
      "/hostels/maghs/2.jpg",
      "/hostels/maghs/3.jpg",
      "/hostels/maghs/4.jpg",
      "/hostels/maghs/5.jpg",
      "/hostels/maghs/6.jpg",
      "/hostels/maghs/7.jpg",
      "/hostels/maghs/8.jpg",
      "/hostels/maghs/9.jpg"
    ],
    rating: 4.1,
    reviews: 90,
    type: "hostel",
    gender: "girls",
  },
  {
    id: 8,
    name: "RKHs Girls",
    price: 13500,
    distance: {
      GCET: 0.7,
      NIET: 0.4,
      "G L BAJAJ": 1.1,
      GNIOT: 0.6,
      "Galgotia University": 1.3,
      KCC: 1.9,
      IIMT: 1.1,
      "Sharda University": 1.6,
      Other: 1.1,
    },
    address: "12 Omega-I, Greater Noida",
    description:
      "RKHs Girls is designed for tech-savvy students with high-speed internet and modern amenities. It's located close to major tech institutions and offers a comfortable stay.",
    amenities: ["High-Speed WiFi", "AC Rooms", "Tech Lounge", "Mess", "Laundry", "Security"],
    images: [
      "/hostels/rkhs-girls/1.jpg",
      "/hostels/rkhs-girls/2.jpg",
      "/hostels/rkhs-girls/3.jpg",
      "/hostels/rkhs-girls/4.jpg",
      "/hostels/rkhs-girls/5.jpg",
      "/hostels/rkhs-girls/6.jpg",
      "/hostels/rkhs-girls/7.jpg",
      "/hostels/rkhs-girls/8.jpg",
      "/hostels/rkhs-girls/9.jpg",
      "/hostels/rkhs-girls/10.jpg"
    ],
    rating: 4.6,
    reviews: 140,
    type: "hostel",
    gender: "girls",
  },
  {
    id: 9,
    name: "WHIHs",
    price: 13000,
    distance: {
      GCET: 0.8,
      NIET: 0.6,
      "G L BAJAJ": 1.0,
      GNIOT: 0.8,
      "Galgotia University": 1.5,
      KCC: 2.0,
      IIMT: 1.3,
      "Sharda University": 1.8,
      Other: 1.4,
    },
    address: "45 Knowledge Park-II, Greater Noida",
    description:
      "WHIHs offers premium accommodation with modern amenities and a focus on student comfort. Known for its excellent facilities and supportive environment.",
    amenities: ["WiFi", "AC Rooms", "Gym", "Mess", "TV Lounge", "Security", "Power Backup"],
    images: [
      "/hostels/whihs/1.jpg",
      "/hostels/whihs/2.jpg",
      "/hostels/whihs/3.jpg",
      "/hostels/whihs/4.jpg",
      "/hostels/whihs/5.jpg",
      "/hostels/whihs/6.jpg"
    ],
    rating: 4.5,
    reviews: 125,
    type: "hostel",
    gender: "girls",
  },
  {
    id: 10,
    name: "JITGHs",
    price: 8000,
    distance: {
      GCET: 1.3,
      NIET: 1.1,
      "G L BAJAJ": 0.8,
      GNIOT: 1.3,
      "Galgotia University": 2.1,
      KCC: 2.6,
      IIMT: 1.9,
      "Sharda University": 2.5,
      Other: 1.8,
    },
    address: "67 Xu-III, Greater Noida",
    description:
      "JITGHs offers comfortable accommodation with all essential facilities. Perfect for students looking for a peaceful environment.",
    amenities: ["WiFi", "Mess", "Power Backup", "Security", "Laundry"],
    images: [
      "/hostels/jitghs/1.jpg",
      "/hostels/jitghs/2.jpg",
      "/hostels/jitghs/3.jpg",
      "/hostels/jitghs/4.jpg",
      "/hostels/jitghs/5.jpg",
      "/hostels/jitghs/6.jpg"
    ],
    rating: 4.0,
    reviews: 85,
    type: "pg",
    gender: "girls",
  },
  {
    id: 11,
    name: "MohanHs",
    price: 6500,
    distance: {
      GCET: 0.7,
      NIET: 0.4,
      "G L BAJAJ": 1.1,
      GNIOT: 0.6,
      "Galgotia University": 1.3,
      KCC: 1.9,
      IIMT: 1.1,
      "Sharda University": 1.6,
      Other: 1.1,
    },
    address: "12 Omega-I, Greater Noida",
    description:
      "MohanHs PG offers affordable accommodation with modern amenities. Suitable for both boys and girls with separate wings.",
    amenities: ["WiFi", "AC Rooms", "Mess", "Laundry", "Security"],
    images: [
      "/hostels/mohanhs/1.jpg",
      "/hostels/mohanhs/2.jpg",
      "/hostels/mohanhs/3.jpg",
      "/hostels/mohanhs/4.jpg",
      "/hostels/mohanhs/5.jpg"
    ],
    rating: 4.2,
    reviews: 120,
    type: "pg",
    gender: "boys",
  },
  {
    id: 12,
    name: "MohanHs Girls",
    price: 6500,
    distance: {
      GCET: 0.7,
      NIET: 0.4,
      "G L BAJAJ": 1.1,
      GNIOT: 0.6,
      "Galgotia University": 1.3,
      KCC: 1.9,
      IIMT: 1.1,
      "Sharda University": 1.6,
      Other: 1.1,
    },
    address: "12 Omega-I, Greater Noida",
    description:
      "MohanHs PG offers affordable accommodation with modern amenities. Suitable for both boys and girls with separate wings.",
    amenities: ["WiFi", "AC Rooms", "Mess", "Laundry", "Security"],
    images: [
      "/hostels/mohanhs-girls/1.jpg",
      "/hostels/mohanhs-girls/2.jpg",
      "/hostels/mohanhs-girls/3.jpg",
      "/hostels/mohanhs-girls/4.jpg",
      "/hostels/mohanhs-girls/5.jpg",
      "/hostels/mohanhs-girls/6.jpg",
      "/hostels/mohanhs-girls/7.jpg",
      "/hostels/mohanhs-girls/8.jpg"
    ],
    rating: 4.2,
    reviews: 120,
    type: "pg",
    gender: "girls",
  },
  {
    id: 13,
    name: "SINHs",
    price: 7000,
    distance: {
      GCET: 0.7,
      NIET: 0.4,
      "G L BAJAJ": 1.1,
      GNIOT: 0.6,
      "Galgotia University": 1.3,
      KCC: 1.9,
      IIMT: 1.1,
      "Sharda University": 1.6,
      Other: 1.1,
    },
    address: "89 Delta-I, Greater Noida",
    description:
      "SINHs PG provides comfortable accommodation with all necessary facilities. Known for its clean environment and good food.",
    amenities: ["WiFi", "AC Rooms", "Mess", "Laundry", "Security"],
    images: [
      "/hostels/sinhs/1.jpg",
      "/hostels/sinhs/2.jpg",
      "/hostels/sinhs/3.jpg"
    ],
    rating: 4.1,
    reviews: 95,
    type: "pg",
    gender: "boys",
  },
  {
    id: 14,
    name: "VIJAYHs",
    price: 6000,
    distance: {
      GCET: 0.7,
      NIET: 0.4,
      "G L BAJAJ": 1.1,
      GNIOT: 0.6,
      "Galgotia University": 1.3,
      KCC: 1.9,
      IIMT: 1.1,
      "Sharda University": 1.6,
      Other: 1.1,
    },
    address: "12 Omega-I, Greater Noida",
    description:
      "VIJAYHs PG offers budget-friendly accommodation with essential facilities. Perfect for students looking for affordable options.",
    amenities: ["WiFi", "Mess", "Laundry", "Security"],
    images: [
      "/hostels/vijayhs/1.jpg",
      "/hostels/vijayhs/2.jpg",
      "/hostels/vijayhs/3.jpg",
      "/hostels/vijayhs/4.jpg"
    ],
    rating: 3.9,
    reviews: 80,
    type: "pg",
    gender: "boys",
  },
  {
    id: 15,
    name: "MANYAHs",
    price: 6000,
    distance: {
      GCET: 0.7,
      NIET: 0.4,
      "G L BAJAJ": 1.1,
      GNIOT: 0.6,
      "Galgotia University": 1.3,
      KCC: 1.9,
      IIMT: 1.1,
      "Sharda University": 1.6,
      Other: 1.1,
    },
    address: "89 Delta-I, Greater Noida",
    description:
      "MANYAHs PG provides affordable accommodation with separate wings for boys and girls. Known for its homely environment.",
    amenities: ["WiFi", "Mess", "Laundry", "Security"],
    images: [
      "/hostels/manyahs/1.jpg",
      "/hostels/manyahs/2.jpg",
      "/hostels/manyahs/3.jpg",
      "/hostels/manyahs/4.jpg"
    ],
    rating: 4.0,
    reviews: 90,
    type: "pg",
    gender: "boys",
  },
  {
    id: 16,
    name: "MANYAHs Girls",
    price: 6000,
    distance: {
      GCET: 0.7,
      NIET: 0.4,
      "G L BAJAJ": 1.1,
      GNIOT: 0.6,
      "Galgotia University": 1.3,
      KCC: 1.9,
      IIMT: 1.1,
      "Sharda University": 1.6,
      Other: 1.1,
    },
    address: "89 Delta-I, Greater Noida",
    description:
      "MANYAHs PG provides affordable accommodation with separate wings for boys and girls. Known for its homely environment.",
    amenities: ["WiFi", "Mess", "Laundry", "Security"],
    images: [
      "/hostels/manyahs-girls/1.jpg",
      "/hostels/manyahs-girls/2.jpg",
      "/hostels/manyahs-girls/3.jpg",
      "/hostels/manyahs-girls/4.jpg",
      "/hostels/manyahs-girls/5.jpg"
    ],
    rating: 4.0,
    reviews: 90,
    type: "pg",
    gender: "girls",
  },
  {
    id: 17,
    name: "OMHs",
    price: 7500,
    distance: {
      GCET: 0.7,
      NIET: 0.4,
      "G L BAJAJ": 1.1,
      GNIOT: 0.6,
      "Galgotia University": 1.3,
      KCC: 1.9,
      IIMT: 1.1,
      "Sharda University": 1.6,
      Other: 1.1,
    },
    address: "89 Delta-I, Greater Noida",
    description:
      "OMHs PG offers comfortable accommodation with modern amenities. Known for its clean environment and good facilities.",
    amenities: ["WiFi", "AC Rooms", "Mess", "Laundry", "Security"],
    images: [
      "/hostels/omhs/1.jpg",
      "/hostels/omhs/2.jpg",
      "/hostels/omhs/3.jpg",
      "/hostels/omhs/4.jpg",
      "/hostels/omhs/5.jpg",
      "/hostels/omhs/6.jpg",
      "/hostels/omhs/7.jpg",
      "/hostels/omhs/8.jpg",
      "/hostels/omhs/9.jpg"
    ],
    rating: 4.2,
    reviews: 100,
    type: "pg",
    gender: "boys",
  },
  {
    id: 18,
    name: "PREHs",
    price: 7000,
    distance: {
      GCET: 0.7,
      NIET: 0.4,
      "G L BAJAJ": 1.1,
      GNIOT: 0.6,
      "Galgotia University": 1.3,
      KCC: 1.9,
      IIMT: 1.1,
      "Sharda University": 1.6,
      Other: 1.1,
    },
    address: "89 Delta-I, Greater Noida",
    description:
      "PREHs PG provides comfortable accommodation exclusively for girls. Known for its safe environment and good facilities.",
    amenities: ["WiFi", "AC Rooms", "Mess", "Laundry", "Security"],
    images: [
      "/hostels/prehs/placeholder.jpg",
      "/hostels/prehs/placeholder.jpg",
      "/hostels/prehs/placeholder.jpg",
      "/hostels/prehs/placeholder.jpg",
      "/hostels/prehs/placeholder.jpg",
      "/hostels/prehs/placeholder.jpg",
      "/hostels/prehs/placeholder.jpg",
      "/hostels/prehs/placeholder.jpg",
      "/hostels/prehs/placeholder.jpg",
      "/hostels/prehs/placeholder.jpg"
    ],
    rating: 4.3,
    reviews: 110,
    type: "pg",
    gender: "girls",
  }
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












