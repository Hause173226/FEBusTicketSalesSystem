import axiosInstance from "./axiosInstance";

// Types for booking
type Booking = {
  trip: string,
  customer: string,
  seatNumber: string[],
  totalPrice: number,
  bookingStatus: string,
  paymentStatus: string
};

// Create a new booking
export const createBooking = async (bookingData: Booking) => {
  const response = await axiosInstance.post('/booking', bookingData);
  return response.data;
};


// Cancel a booking
export const cancelBooking = async (bookingId: string) => {
  const response = await axiosInstance.patch(`/booking/cancel/${bookingId}`);
  return response.data;
};

