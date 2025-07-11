
import axiosInstance from "./axiosInstance";
import { Booking } from "../types";

// Create a new booking
export const createBooking = async (bookingData: {
  trip: string;
  customer: string;
  pickupStation: string;
  dropoffStation: string;
  seatNumbers: string[];
  totalAmount: number;
}) => {
  const response = await axiosInstance.post<{ data: Booking }>('/booking', bookingData);
  return response.data.data;
};

// Get booking by ID
export const getBookingById = async (bookingId: string) => {
  const response = await axiosInstance.get<{ data: Booking }>(`/booking/${bookingId}`);
  return response.data.data;
};

// Get user's bookings
export const getUserBookings = async () => {
  const response = await axiosInstance.get<{ data: Booking[] }>('/booking/user');
  return response.data.data;
};

// Cancel a booking
export const cancelBooking = async (bookingId: string) => {
  const response = await axiosInstance.put<{ data: Booking }>(`/booking/cancel/${bookingId}`);
  return response.data.data;
};

// Update booking payment status
export const updateBookingPaymentStatus = async (bookingId: string, paymentStatus: string) => {
  const response = await axiosInstance.put<{ data: Booking }>(`/booking/${bookingId}/payment-status`, {
    paymentStatus
  });
  return response.data.data;
};
export const getBookingHistoryByCustomer = async (customerId: string) => {
  const response = await axiosInstance.get<{ data: Booking[] }>(`/booking/history/${customerId}`);
  return response.data.data;
};
