import axiosInstance from "./axiosInstance";
import { Station, StationWithCity } from "../types";

// Get all stations
export const getAllStations = async (): Promise<Station[]> => {
  const response = await axiosInstance.get("/station");
  return response.data;
};

// Get station by ID
export const getStationById = async (id: string): Promise<Station> => {
  const response = await axiosInstance.get(`/station/${id}`);
  // Xử lý cấu trúc response API {success, data} nếu cần
  return response.data.data || response.data;
};

interface CreateStationRequest {
  name: string;
  code: string;
  address: string;
  status: "active";
}

// Create new station
export const createStation = async (stationData: CreateStationRequest): Promise<Station> => {
  const response = await axiosInstance.post("/station", stationData);
  return response.data;
};

// Update station
export const updateStation = async (id: string, stationData: Partial<Station>): Promise<Station> => {
  const response = await axiosInstance.put(`/station/${id}`, stationData);
  return response.data;
};

// Delete station
export const deleteStation = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/station/${id}`);
};



// Get stations with city names
export const getStationsWithCityNames = async (): Promise<StationWithCity[]> => {
  const response = await axiosInstance.get("/station/city-names");
  return response.data;
};
