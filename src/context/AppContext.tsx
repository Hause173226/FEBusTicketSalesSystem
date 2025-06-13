import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Booking, Route, SearchParams, Seat, User } from '../types';


interface AppContextProps {
  user: User | null;
  isLoggedIn: boolean;
  selectedRoute: Route | null;
  selectedSeats: Seat[];
  searchParams: SearchParams;
  currentBooking: Partial<Booking> | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  setSelectedRoute: (route: Route | null) => void;
  toggleSeatSelection: (seat: Seat) => void;
  updateSearchParams: (params: Partial<SearchParams>) => void;
  resetBooking: () => void;
  createBooking: (paymentMethod: string) => Promise<Booking>;
  getBookedTickets: () => Booking[];
  cancelBooking: (bookingId: string) => Promise<void>;
}

const defaultSearchParams: SearchParams = {
  from: '',
  to: '',
  date: null,
};

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>(defaultSearchParams);
  const [currentBooking, setCurrentBooking] = useState<Partial<Booking> | null>(null);

  const login = async (email: string, password: string) => {
    try {
      // Gọi API đăng nhập
      const { userServices } = await import('../services/userServices');
      const signinRes = await userServices.signin(email, password);
      if (signinRes.status !== 200 || !signinRes.data) {
        throw new Error('Đăng nhập thất bại');
      }
      // Nếu trả về user object trực tiếp
      if (signinRes.data.user) {
        setUser(signinRes.data.user);
        return;
      }
      // Nếu trả về userId thì gọi tiếp getUser
      if (signinRes.data.userId) {
        const userRes = await userServices.getUser(signinRes.data.userId);
        if (userRes.status !== 200 || !userRes.data) {
          throw new Error('Không lấy được thông tin người dùng');
        }
        setUser(userRes.data);
        return;
      }
      throw new Error('Phản hồi đăng nhập không hợp lệ');
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    resetBooking();
  };

  const register = async (name: string, email: string, password: string, phone: string) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // In a real app, this would create a new user in the database
        const newUser: User = {
          id: `user-${Date.now()}`,
          name,
          email,
          phone,
          bookings: [],
        };
        setUser(newUser);
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
    setSelectedSeats([]);
    setCurrentBooking(null);
  };

  const createBooking = async (paymentMethod: string): Promise<Booking> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!user || !selectedRoute || selectedSeats.length === 0) {
          throw new Error('Missing booking information');
        }

        const newBooking: Booking = {
          id: `booking-${Date.now()}`,
          routeId: selectedRoute.id,
          userId: user.id,
          seatIds: selectedSeats.map((seat) => seat.id),
          totalPrice: selectedSeats.reduce((sum, seat) => sum + seat.price, 0),
          bookingDate: new Date().toISOString().split('T')[0],
          travelDate: searchParams.date
            ? searchParams.date.toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          status: 'confirmed',
          paymentMethod,
          qrCode: `${selectedRoute.id}-${user.id}-${Date.now()}`,
        };

        // Update user bookings
        if (user) {
          setUser({
            ...user,
            bookings: [...user.bookings, newBooking],
          });
        }

        setCurrentBooking(newBooking);
        resolve(newBooking);
      }, 1500);
    });
  };

  const getBookedTickets = () => {
    return user?.bookings || [];
  };

  const cancelBooking = async (bookingId: string) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (user) {
          const updatedBookings = user.bookings.map((booking) => {
            if (booking.id === bookingId) {
              return { ...booking, status: 'cancelled' };
            }
            return booking;
          });

          setUser({
            ...user,
            bookings: updatedBookings,
          });
        }
        resolve();
      }, 1000);
    });
  };

  const value = {
    user,
    isLoggedIn: !!user,
    selectedRoute,
    selectedSeats,
    searchParams,
    currentBooking,
    login,
    logout,
    register,
    setSelectedRoute,
    toggleSeatSelection,
    updateSearchParams,
    resetBooking,
    createBooking,
    getBookedTickets,
    cancelBooking,
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