import axiosInstance from "./axiosInstance";

export const driversServices = {
  // Get all drivers
  getAllDrivers: () => {
    return axiosInstance.get("/drivers");
  },

  // Create a new driver
  createDriver: (driverData: any) => {
    return axiosInstance.post("/drivers", driverData);
  },

  // Update driver information
  updateDriver: (id: string, driverData: any) => {
    return axiosInstance.put(`/drivers/${id}`, driverData);
  },

  // Delete a driver
  deleteDriver: (id: string) => {
    return axiosInstance.delete(`/drivers/${id}`);
  },
};
