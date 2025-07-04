import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Booking, Route, SearchParams, Seat, Profile, Trip } from '../types';


interface AppContextProps {
  profile: Profile | null;
  isLoggedIn: boolean;
  selectedRoute: Route | null;
  selectedSeats: Seat[];
  searchParams: SearchParams;
  currentBooking: Partial<Booking> | null;
  selectedTrip: Trip | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  setSelectedRoute: (route: Route | null) => void;
  setSelectedTrip: (trip: Trip | null) => void;
  toggleSeatSelection: (seat: Seat) => void;
  updateSearchParams: (params: Partial<SearchParams>) => void;
  resetBooking: () => void;
  createBooking: (paymentMethod: string) => Promise<Booking>;
  getBookedTickets: () => Booking[];
  cancelBooking: (bookingId: string) => Promise<void>;
  setProfile: (profile: Profile | null) => void;
}

const defaultSearchParams: SearchParams = {
  from: '',
  to: '',
  date: null,
  searchBy: 'city',
};

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(() => {
    // Initialize profile from localStorage if available
    const profileData = localStorage.getItem('profile');
    return profileData ? JSON.parse(profileData) : null;
  });
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>(defaultSearchParams);
  const [currentBooking, setCurrentBooking] = useState<Partial<Booking> | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check for existing token and validate/refresh on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (token && refreshToken) {
        try {
          const { userServices } = await import('../services/userServices');
          
          // Get user data first if not already loaded
          if (!profile) {
            const profileData = localStorage.getItem('profile');
            if (profileData) {
              setProfile(JSON.parse(profileData));
            }
          }
          
          // Try to refresh token with correct format
          const refreshResponse = await userServices.refreshToken(refreshToken);
          
          // Update tokens if new ones are returned
          if (refreshResponse.data?.accessToken) {
            localStorage.setItem('token', refreshResponse.data.accessToken);
          }
          if (refreshResponse.data?.refreshToken) {
            localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);
          }
          
          // Update user data if returned
          if (refreshResponse.data?.user) {
            setProfile(refreshResponse.data.user as Profile);
            localStorage.setItem('profile', JSON.stringify(refreshResponse.data.user));
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          // If refresh fails, don't clear tokens - let the user continue with existing tokens
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  // Prevent rendering children until initialization is complete
  if (!isInitialized) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  const login = async (email: string, password: string) => {
    try {
      const { userServices } = await import('../services/userServices');
      const signinRes = await userServices.signin(email, password);
      if (signinRes.status !== 200 || !signinRes.data) {
        throw new Error('Đăng nhập thất bại');
      }

      // Store the tokens
      if (signinRes.data.accessToken) {
        localStorage.setItem('token', signinRes.data.accessToken);
      }
      if (signinRes.data.refreshToken) {
        localStorage.setItem('refreshToken', signinRes.data.refreshToken);
      }

      // Store user data
      if (signinRes.data.user) {
        setProfile(signinRes.data.user as Profile);
        localStorage.setItem('profile', JSON.stringify(signinRes.data.user));
        return;
      }

      // If only userId returned, fetch user data
      if (signinRes.data.userId) {
        const userRes = await userServices.getProfile ();
        if (userRes.status !== 200 || !userRes.data) {
          throw new Error('Không thể lấy thông tin người dùng');
        }
        setProfile(userRes.data as Profile);
        localStorage.setItem('profile', JSON.stringify(userRes.data));
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Use the signout service
      const { signoutService } = await import('../services/signoutService');
      await signoutService.handleSignout();
      
      // Clear user state
      setProfile(null);
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user state if something goes wrong
      setProfile(null);
    }
  };

  const register = async (name: string, email: string, password: string, phone: string) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // In a real app, this would create a new user in the database
        const newUser: Profile = {
          _id: `user-${Date.now()}`,
          fullName: name,
          email,
          phone,
          bookings: [],
          citizenId: '',
          dateOfBirth: '',
          role: 'user',
          gender: 'male',
          address: '',
        };
        setProfile(newUser);
        resolve();
      }, 1000);
    });
  };

  const toggleSeatSelection = (seat: Seat) => {
    if (!seat.isAvailable) return;

    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, { ...seat, price: selectedRoute?.price || 0 }]);
    }
  };

  const updateSearchParams = (params: Partial<SearchParams>) => {
    setSearchParams({ ...searchParams, ...params });
  };

  const resetBooking = () => {
    setSelectedRoute(null);
    setSelectedTrip(null);
    setSelectedSeats([]);
    setCurrentBooking(null);
  };

  const createBooking = async (paymentMethod: string): Promise<Booking> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!profile || !selectedRoute || selectedSeats.length === 0) {
          throw new Error('Missing booking information');
        }

        const newBooking: Booking = {
          _id: `booking-${Date.now()}`,
          trip: selectedTrip as unknown as Trip,
          customer: profile as unknown as Profile,
          seatNumber: selectedSeats.map((seat) => seat.id),
          totalPrice: selectedSeats.reduce((sum, seat) => sum + seat.price, 0),
          bookingStatus: 'pending',
          paymentStatus: 'pending',
        };

        // Update user bookings
        if (profile) {
          setProfile({
            ...profile,
            bookings: [...profile.bookings, newBooking],
          });
        }

        setCurrentBooking(newBooking);
        resolve(newBooking);
      }, 1500);
    });
  };

  const getBookedTickets = () => {
    return profile?.bookings || [];
  };

  const cancelBooking = async (bookingId: string) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (profile) {
          const updatedBookings = profile.bookings.map((booking) => {
            if (booking._id === bookingId) {
              return { ...booking, status: 'cancelled' };
            }
            return booking;
          });

          setProfile({
            ...profile,
            bookings: updatedBookings,
          });
        }
        resolve();
      }, 1000);
    });
  };

  const value = {
    profile,
    isLoggedIn: !!profile,
    selectedRoute,
    selectedTrip,
    selectedSeats,
    searchParams,
    currentBooking,
    login,
    logout,
    register,
    setSelectedRoute,
    setSelectedTrip,
    toggleSeatSelection,
    updateSearchParams,
    resetBooking,
    createBooking,
    getBookedTickets,
    cancelBooking,
    setProfile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};