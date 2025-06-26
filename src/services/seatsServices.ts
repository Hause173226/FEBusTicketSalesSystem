import axiosInstance from "./axiosInstance";

interface SeatBookingResponse {
    seatBookingId: string;
    seatId: string;
    seatNumber: string;
    status: string;
    isAvailable: boolean;
    isSelected: boolean;
    isBooked: boolean;
    lockedUntil: string;
    bookedBy: string;
    bookingCode: string;
}

interface ApiResponse {
  data: SeatBookingResponse[];
}

interface SelectSeatRequest {
  tripId: string;
  seatNumbers: string[];
}

interface ReleaseSeatRequest {
  tripId: string;
  seatNumbers: string[];
}

interface ConfirmSeatRequest {
  tripId: string;
  seatNumbers: string[];
  bookingId: string;
}

export const seatsServices = {
  // Get available seats for a trip
  getAvailableSeats: async (tripId: string): Promise<SeatBookingResponse[]> => {
      const response = await axiosInstance.get<ApiResponse>(`/seat-booking/trip/${tripId}`);
      return response.data.data;
    },
 
  // Select a seat (temporary lock)
  selectSeat: async (data: SelectSeatRequest): Promise<SeatBookingResponse> => {
    const response = await axiosInstance.post('/seat-booking/select', data);
    return response.data;
  },

  // Release a seat
  releaseSeat: async (data: ReleaseSeatRequest): Promise<SeatBookingResponse> => {
    const response = await axiosInstance.post('/seat-booking/release', data);
    return response.data;
  },

  // Confirm seat booking
  confirmSeatBooking: async (data: ConfirmSeatRequest): Promise<SeatBookingResponse> => {
    const response = await axiosInstance.post('/seat-booking/confirm', data);
    return response.data;
  }
};
