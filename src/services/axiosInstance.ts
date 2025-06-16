import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
  withCredentials: true,
  // Bạn có thể thêm headers mặc định ở đây nếu cần
});

export default axiosInstance;
