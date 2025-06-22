import axiosInstance from "./axiosInstance";

export const busOperatorServices = {
  // Get all drivers
  getAllBusOperators: () => {
    return axiosInstance.get("/bus-operators");
  },

  
};