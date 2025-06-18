import axiosInstance from "./axiosInstance";
import { Station } from "../types";

export const getAllStations = async (): Promise<Station[]> => {
  const response = await axiosInstance.get("/stations");
  return response.data;
};

export const getStationById = async (id: string): Promise<Station> => {
  const response = await axiosInstance.get(`/stations/${id}`);
  return response.data;
};
