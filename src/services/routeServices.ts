import axiosInstance from "./axiosInstance";
import { Route } from "../types";

export const getAllRoutes = async (): Promise<Route[]> => {
  const response = await axiosInstance.get("/route");
  return response.data;
};

export const getRouteById = async (id: string): Promise<Route> => {
  const response = await axiosInstance.get(`/route/${id}`);
  // Kiểm tra xem API trả về có cấu trúc {success, data} không
  if (response.data.data) {
    return response.data.data;
  }
  return response.data;
};

export const searchRoutes = async (params: {
  startLocationId?: string;
  endLocationId?: string;
}): Promise<Route[]> => {
  const response = await axiosInstance.get("/route/search", { params });
  return response.data;
};
