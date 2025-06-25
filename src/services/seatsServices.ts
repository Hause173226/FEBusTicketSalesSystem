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
  lockDurationMinutes: number;
}

export const seatsServices = {
  // Get available seats for a trip
  getAvailableSeats: async (tripId: string): Promise<SeatBookingResponse[]> => {
    try {
      console.log('Fetching seats for trip:', tripId);
      const response = await axiosInstance.get<ApiResponse>(`/seat-booking/trip/${tripId}`);
      console.log('API Response:', response.data);
      return response.data.data; // Extract the data array from the response
    } catch (error) {
      console.error('Error fetching seats:', error);
      throw error;
    }
  },

  // Select a seat (temporary lock)
  selectSeat: async (data: { tripId: string; seatNumber: string }): Promise<SeatBookingResponse> => {
    const selectRequest: SelectSeatRequest = {
      tripId: data.tripId,
      seatNumbers: [data.seatNumber],
      lockDurationMinutes: 10
    };
    const response = await axiosInstance.post('/seat-booking/select', selectRequest);
    return response.data;
  },

  // Release a seat
  releaseSeat: async (data: { tripId: string; seatNumber: string }): Promise<SeatBookingResponse> => {
    const releaseRequest = {
      tripId: data.tripId,
      seatNumbers: [data.seatNumber]
    };
    const response = await axiosInstance.post('/seat-booking/release', releaseRequest);
    return response.data;
  },

  // Confirm seat booking
  confirmSeatBooking: async (data: { tripId: string; seatNumber: string }): Promise<SeatBookingResponse> => {
    const confirmRequest = {
      tripId: data.tripId,
      seatNumbers: [data.seatNumber]
    };
    const response = await axiosInstance.post('/seat-booking/confirm', confirmRequest);
    return response.data;
  }
};
