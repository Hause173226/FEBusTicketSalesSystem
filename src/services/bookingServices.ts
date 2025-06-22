import axiosInstance from "./axiosInstance";
import { Booking } from "../types";

export const getBookingById = async (id: string): Promise<Booking> => {
  const response = await axiosInstance.get(`/bookings/${id}`);
  return response.data;
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  const response = await axiosInstance.get(`/bookings/user/${userId}`);
  return response.data;
};
export const getCustomerById = async (id: string): Promise<any> => {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data;
};


