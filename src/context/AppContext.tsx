import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Booking, Route, SearchParams, Seat, User } from '../types';
import { busLayout, mockUser, routes } from '../data';

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
  const [user, setUser] = useState<User | null>(() => {
    // Lấy user từ localStorage khi load lại trang
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>(defaultSearchParams);
  const [currentBooking, setCurrentBooking] = useState<Partial<Booking> | null>(null);

  const login = async (phone: string, password: string) => {
    // Gọi API login ở userServices, userServices đã lưu user vào localStorage
    await import('../services/userServices').then(async ({ userServices }) => {
      await userServices.login(phone, password);
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    });
  };

  const logout = () => {
    import('../services/userServices').then(({ userServices }) => {
      userServices.logout();
      setUser(null);
      resetBooking();
    });
  };

  const register = async (name: string, phone: string, email: string, password: string) => {
    await import('../services/userServices').then(async ({ userServices }) => {
      await userServices.register(name, phone, email, password);
      // Sau khi đăng ký, có thể tự động đăng nhập ở đây nếu muốn
      setUser(null);
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