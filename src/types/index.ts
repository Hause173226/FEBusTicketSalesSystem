export interface Route {
  id: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  company: string;
  busType: string;
  totalSeats: number;
  availableSeats: number;
  popular: boolean;
}

export interface Seat {
  id: string;
  number: string;
  isAvailable: boolean;
  price: number;
  type: 'standard' | 'premium' | 'vip';
}

export interface BusLayout {
  rows: number;
  columns: number;
  seats: Seat[];
  aisleAfterColumn?: number;
}

export interface Booking {
  id: string;
  routeId: string;
  userId: string;
  seatIds: string[];
  totalPrice: number;
  bookingDate: string;
  travelDate: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  paymentMethod: string;
  qrCode?: string;
}

export interface User {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  citizenId: string;
  dateOfBirth: string;
  role: string;
  gender: string;
  address: string;
  bookings: Booking[];
}

export interface SearchParams {
  from: string;
  to: string;
  date: Date | null;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export type City = {
  id: string;
  name: string;
};