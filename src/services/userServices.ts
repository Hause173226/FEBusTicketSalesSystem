import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add axios interceptor to include token in requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userServices = {
  getUser: () => {
    return api.get("/user");
  },

  login: async (phone: string, password: string) => {
    const response = await api.post("/user/signin", { phone, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return api.post("/user/signout");
  },

  register: async (fullName: string, phone: string, email: string, password: string) => {
    const response = await api.post("/user/signup", { fullName, phone, email, password });
    return response;
  },
};
