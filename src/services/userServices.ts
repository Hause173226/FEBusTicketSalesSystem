import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
  withCredentials: true,
});

export const userServices = {
  getUser: (id: string ) => {
    return api.get(`/users/${id}`);
  },
  register: (fullName: string, phone: string, email: string, password: string) => {
    return api.post("/users/signup", {
      fullName,
      phone,
      email,
      password,
    });
  },
  signin: (email: string, password: string) => {
    return api.post("/users/signin", {
      email,
      password,
    });
  },
  forgotPassword: (email: string) => {
    return api.post("/users/forgot-password", {
      email,
    });
  },
  resendOTP: (email: string) => {
    return api.post("/users/resend-otp", {
      email,
    });
  },
  resetPassword: (email: string, otp: string, newPassword: string) => {
    return api.post("/users/reset-password", {
      email,
      otp,
      newPassword,
    });
  },
};
