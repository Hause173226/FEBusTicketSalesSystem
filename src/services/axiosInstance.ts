import axios from "axios";
import { userServices } from "./userServices";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: any | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // If token refresh is in progress, queue the request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return axiosInstance(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Call refresh token endpoint
      const response = await userServices.refreshToken();
      
      // Store new token and user data if returned
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      if (response.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      // Reset refreshing flag
      isRefreshing = false;
      
      // Process queued requests
      processQueue(null, response.data?.token);
      
      // Update the failed request's Authorization header
      if (response.data?.token) {
        originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
      }
      
      // Retry the original request
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // If refresh token fails, clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Reset refreshing flag and process queue with error
      isRefreshing = false;
      processQueue(refreshError);
      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;
