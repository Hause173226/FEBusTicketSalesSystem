
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
// Cancel a booking
export const cancelBooking = async (bookingId: string) => {
  const response = await axiosInstance.put<{ data: Booking }>(`/booking/cancel/${bookingId}`);
  return response.data.data;
};

export const getBookingHistoryByCustomer = async (customerId: string) => {
  const response = await axiosInstance.get<{ data: Booking[] }>(`/booking/history/${customerId}`);
  return response.data.data;
};
