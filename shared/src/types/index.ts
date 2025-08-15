export type UUID = string;

export enum UserType {
  Client = "client",
  Driver = "driver",
  Admin = "admin",
}

export interface GeoPoint {
  lat: number;
  lng: number;
  address?: string;
}

export interface UserProfile {
  id: UUID;
  name: string | null;
  email: string | null;
  phone: string | null;
  type: UserType;
  location?: GeoPoint | null;
  rating?: number | null;
  avatarUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export enum OrderStatus {
  Pending = "pending",
  Accepted = "accepted",
  EnRoute = "enroute",
  Delivered = "delivered",
  Canceled = "canceled",
}

export type PaymentMethod = "card" | "cash";
export type PaymentStatus = "unpaid" | "requires_action" | "paid" | "refunded";

export interface Order {
  id: UUID;
  customerId: UUID;
  driverId?: UUID | null;
  status: OrderStatus;
  amount: number; // minor currency units (e.g., cents)
  origin: GeoPoint;
  destination: GeoPoint;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  distanceKm?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: UUID;
  orderId: UUID;
  senderId: UUID;
  text: string;
  createdAt?: string;
}

export interface DeviceToken {
  id: UUID;
  userId: UUID;
  token: string;
  platform: "ios" | "android" | "web";
  createdAt?: string;
}