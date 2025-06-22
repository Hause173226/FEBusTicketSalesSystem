import axiosInstance from "./axiosInstance";
import { Trip } from "../types";

export const searchTrips = async (params: {
  from: string;
  to: string;
  date: string;
  searchBy: 'city' | 'station';
}): Promise<Trip[]> => {
  const response = await axiosInstance.get("/trips/search", { params });
  return response.data;
};

export const getTripById = async (id: string): Promise<Trip> => {
  const response = await axiosInstance.get(`/trips/${id}`);
  return response.data;
};

export const getTripsByRoute = async (routeId: string): Promise<Trip[]> => {
  const response = await axiosInstance.get(`/trip/route/${routeId}`);
  return response.data;
};
