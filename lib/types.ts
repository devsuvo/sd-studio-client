export type Category =
  | "Photography"
  | "Film & Video"
  | "Podcast"
  | "Music Recording"
  | "Art Workshop"
  | "Dance & Rehearsal";

export interface Studio {
  _id: string;
  title: string;
  description: string;
  category: Category;
  city: string;
  address: string;
  hourlyRate: number;
  cleaningFee: number;
  capacity: number;
  sizeSqft: number;
  minHours: number;
  openHour: number;
  closeHour: number;
  amenities: string[];
  equipment: string[];
  images: string[];
  rules: string;
  hostId: string;
  hostName: string;
  hostEmail: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export type StudioInput = Omit<
  Studio,
  "_id" | "hostId" | "hostName" | "hostEmail" | "rating" | "reviewCount" | "createdAt"
>;

export interface StudioPage {
  items: Studio[];
  total: number;
  page: number;
  pages: number;
}

export type BookingStatus = "pending" | "confirmed" | "declined" | "cancelled";

export interface Booking {
  _id: string;
  studioId: string;
  studio: { title: string; image: string; city: string; category: Category };
  hostId: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  date: string;
  startHour: number;
  endHour: number;
  hours: number;
  pricing: { hourlyRate: number; subtotal: number; cleaningFee: number; serviceFee: number; total: number };
  note: string;
  status: BookingStatus;
  createdAt: string;
}

export interface Availability {
  date: string;
  openHour: number;
  closeHour: number;
  minHours: number;
  bookable: boolean;
  booked: { startHour: number; endHour: number; status: BookingStatus }[];
}

export interface Summary {
  bookings: number;
  upcoming: number;
  spent: number;
  listings: number;
  pendingRequests: number;
  earnings: number;
}

export interface Stats {
  studios: number;
  cities: number;
  hosts: number;
  bookings: number;
  categories: Record<string, number>;
}
