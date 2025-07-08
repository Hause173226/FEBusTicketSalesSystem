import { toast } from "react-hot-toast";

// Function to handle token expiration globally
export const handleTokenExpiration = () => {
  // Clear tokens and user data
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('profile');
  
  // Show notification
  toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', {
    duration: 4000,
    style: {
      background: '#ef4444',
      color: 'white',
    },
  });
  
  // Redirect to login page after a short delay
  setTimeout(() => {
    // Use window.location.href to ensure full page reload and context reset
    window.location.href = '/login';
  }, 1000);
};

// Function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  return !!(token && refreshToken);
};

// Function to get current user data from localStorage
export const getCurrentUser = () => {
  const profileData = localStorage.getItem('profile');
  return profileData ? JSON.parse(profileData) : null;
};
