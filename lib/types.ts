export type Role = "customer" | "owner" | "admin";

export interface Me {
  id: string;
  name: string;
  email: string;
  image: string;
  phone: string;
  address: string;
  role: Role;
  createdAt?: string;
}

export type RentalType = "daily" | "weekly" | "monthly";
export type EquipmentStatus = "pending" | "approved" | "rejected";

export interface Equipment {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  price: number;
  rentalType: RentalType;
  quantity: number;
  condition: string;
  brand: string;
  model: string;
  image: string;
  terms: string;
  status: EquipmentStatus;
  owner: { name: string; email: string; image?: string };
  createdAt: string;
}

export interface Booking {
  _id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImage: string;
  ownerEmail: string;
  ownerName: string;
  customerEmail: string;
  customerName: string;
  startDate: string;
  endDate: string;
  days: number;
  units: number;
  quantity: number;
  contact: string;
  address: string;
  notes: string;
  amount: number;
  paymentStatus: "unpaid" | "paid";
  bookingStatus: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface Review {
  _id?: string;
  name: string;
  rating: number;
  comment: string;
}

export const CATEGORIES = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
] as const;

export const RENTAL_TYPES: RentalType[] = ["daily", "weekly", "monthly"];
