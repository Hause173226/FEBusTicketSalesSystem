export interface Route {
  _id: string;
  name: string;
  code: string;
  originStation?: Station | string;
  destinationStation?: Station | string;
  distanceKm: number;
  estimatedDuration: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}


export interface Seat {
  id: string;
  number: string;
  isAvailable: boolean;
  price: number;
  type: 'standard' | 'premium' | 'vip';
  tripId: string;
}

export interface BusOperator {
  _id: string,
  name: string,
  phone: string,
  email: string,
  address: string,
  licenseNumber: string,
  status: string,
  createdAt: string,
  updatedAt: string
}
export interface BusLayout {
  rows: number;
  columns: number;
  seats: Seat[];
  aisleAfterColumn?: number;
}

export interface Booking {
  _id: string;
  bookingCode: string;
  customer: {
    _id: string;
    fullName: string;
    phone: string;
    email: string;
    password?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
    otpCode?: string;
    otpExpires?: string;
  };
  trip: Trip;
  pickupStation: Station;
  dropoffStation: Station;
  seatNumbers: string[];
  totalAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  paymentDate?: string;
  __v?: number;
}

export interface Profile {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  citizenId?: string;
  dateOfBirth?: string;
  gender?: "male" | "female";
  address?: string;
  role: string;
  bookings: Booking[];
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SearchParams {
  from: string;
  to: string;
  date: Date | null;
  searchBy: 'city' | 'station';
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

export interface Drivers {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  licenseNumber: string;
  status: "active" | "inactive";
  operator: string;
}
export interface Station {
  _id: string;
  name: string;
  code: string;
  address: {
    street: string;
    ward: string;
    district: string;
    city: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Trip {
  _id: string;
  route: Route;
  bus: {
    _id: string;
    operator: string;
    licensePlate: string;
    busType: string;
    seatCount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  tripCode: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  basePrice: number;
  discountPercentage: number;
  status: string;
  availableSeats: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
export interface StationWithCity {
  _id: string;
  name: string;
  address: {
    city: string;
  };
}
export interface OrderId {
  orderId: string;
}

export interface VNPayPaymentRequest {
  bookingId: string;
}

export interface VNPayPaymentResponse {
  code: string;
  message: string;
  payUrl: string;
  orderId: string;
}

export interface VNPayPaymentStatus {
  isSuccess: boolean;
  message: string;
  orderId?: string;
  paymentTime?: string;
  transactionId?: string;
  amount?: number;
}

export interface BookingPaymentDetails {
  _id: string;
  booking: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  notes: string;
  processedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  gatewayResponse: {
    vnp_Amount: string;
    vnp_BankCode: string;
    vnp_BankTranNo: string;
    vnp_CardType: string;
    vnp_OrderInfo: string;
    vnp_PayDate: string;
    vnp_ResponseCode: string;
    vnp_TmnCode: string;
    vnp_TransactionNo: string;
    vnp_TransactionStatus: string;
    vnp_TxnRef: string;
  };
}

export interface BookingOrderDetails {
  orderId: string;
  bookingCode: string;
  status: string;
  customer: Profile;
  trip: {
    route: {
      name: string;
    };
    departureDate: string;
    departureTime: string;
    arrivalTime: string;
  };
  seatNumbers: string[];
  totalAmount: number;
  paymentHistory: BookingPaymentDetails;
}