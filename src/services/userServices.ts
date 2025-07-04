import axiosInstance from "./axiosInstance";
import { Profile } from "../types";

export const userServices = {
  getProfile: () => {
    return axiosInstance.get<Profile>("/users/profile");
  },
  updateProfile: (data: Partial<Profile>) => {
    return axiosInstance.put<Profile>("/users/profile", data);
  },
  register: (
    fullName: string,
    phone: string,
    email: string,
    password: string
  ) => {
    return axiosInstance.post("/users/signup", {
      fullName,
      phone,
      email,
      password,
    });
  },
  signin: (email: string, password: string) => {
    return axiosInstance.post("/users/signin", {
      email,
      password,
    });
  },
  signout: () => {
    return axiosInstance.post("/users/signout");
  },
  forgotPassword: (email: string) => {
    return axiosInstance.post("/users/forgot-password", {
      email,
    });
  },
  resendOTP: (email: string) => {
    return axiosInstance.post("/users/resend-otp", {
      email,
    });
  },
  resetPassword: (email: string, otp: string, newPassword: string) => {
    return axiosInstance.post("/users/reset-password", {
      email,
      otp,
      newPassword,
    });
  },
  refreshToken: (refreshToken: string) => {
    return axiosInstance.post("/users/refresh-token", {
      refreshToken: refreshToken
    });
  },
};
