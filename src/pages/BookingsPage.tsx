import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bus, Calendar, Clock, MapPin } from 'lucide-react';
import { Trip, Seat } from '../types';
import { getTripById } from '../services/tripServices';
import { useAppContext } from '../context/AppContext';
import SeatSelection, { SeatSelectionRef } from '../components/SeatSelection';
import { createBooking } from '../services/bookingServices';

const TEMP_BOOKING_KEY = 'temp_booking_data';

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { profile, selectedTrip } = useAppContext();
  const [trip, setTrip] = useState<Trip | null>(selectedTrip);
  const [paymentMethod, setPaymentMethod] = useState<'vnpay'>('vnpay');
  const [isTripLoading, setIsTripLoading] = useState(!selectedTrip);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSelectedSeats, setCurrentSelectedSeats] = useState<Seat[]>([]);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const navigate = useNavigate();
  const seatSelectionRef = useRef<SeatSelectionRef>(null);


  useEffect(() => {
    // Check if there's temporary booking data in localStorage
    const tempBooking = localStorage.getItem(TEMP_BOOKING_KEY);
    if (tempBooking) {
      const bookingData = JSON.parse(tempBooking);
      if (bookingData.tripId === id) {
        setCurrentSelectedSeats(bookingData.seats);
        setShowPaymentConfirmation(true);
      } else {
        // Clear if it's for a different trip
        localStorage.removeItem(TEMP_BOOKING_KEY);
      }
    }
  }, [id]);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        if (!id) throw new Error('Trip ID is required');
        // Only fetch if we don't have the trip in context
        if (!selectedTrip) {
          const data = await getTripById(id);
          setTrip(data);
        }
      } catch (err) {
        console.error('Failed to fetch trip details:', err);
        setError('Không thể tải thông tin chuyến xe. Vui lòng thử lại sau.');
      } finally {
        setIsTripLoading(false);
      }
    };

    if (!selectedTrip) {
      fetchTripDetails();
    }
  }, [id, selectedTrip]);

  if (isTripLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Đang tải thông tin chuyến xe...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">
            <p>{error || 'Không tìm thấy thông tin chuyến xe'}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleBookingConfirmation = async () => {
    try {
      setIsBooking(true);
      setError(null);
      
      if (!profile) {
        throw new Error('Vui lòng đăng nhập để đặt vé');
      }

      if (!trip) {
        throw new Error('Không tìm thấy thông tin chuyến xe');
      }

      // Get selected seats from ref
      const selectedSeats = seatSelectionRef.current?.getSelectedSeats() || [];
      
      if (selectedSeats.length === 0) {
        throw new Error('Vui lòng chọn ghế trước khi đặt vé');
      }

      // Create booking first
      const bookingData = {
        trip: trip._id,
        customer: profile._id,
        pickupStation: trip.route.originStation._id,
        dropoffStation: trip.route.destinationStation._id,
        seatNumbers: selectedSeats.map((seat: Seat) => seat.number),
        totalAmount: trip.basePrice * selectedSeats.length
      };

      const booking = await createBooking(bookingData);

      // Store booking ID and additional info for confirmation page
      const tempBookingData = {
        bookingId: booking._id,
        bookingCode: booking.bookingCode,
        tripData: trip,
        seatData: selectedSeats,
        customerData: profile
      };

      localStorage.setItem(TEMP_BOOKING_KEY, JSON.stringify(tempBookingData));
      setCurrentSelectedSeats(selectedSeats);
      
      // Navigate to booking confirmation page instead of payment
      navigate(`/booking-confirmation/${booking._id}`);
      
    } catch (err: any) {
      console.error('Booking error:', err);
      
      // Handle specific error messages
      let errorMessage = 'Không thể tạo đặt vé. Vui lòng thử lại sau.';
      
      if (err.response?.data?.message) {
        const serverMessage = err.response.data.message;
        if (serverMessage.includes('Seats not available')) {
          const unavailableSeats = serverMessage.split(':').pop()?.trim();
          errorMessage = `Ghế ${unavailableSeats} đã được đặt bởi người khác. Vui lòng chọn ghế khác.`;
        } else if (serverMessage.includes('seat')) {
          errorMessage = 'Một số ghế đã được người khác chọn. Vui lòng chọn ghế khác.';
        } else {
          errorMessage = serverMessage;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setShowPaymentConfirmation(false);
      
      // Refresh seat availability
      if (seatSelectionRef.current) {
        await seatSelectionRef.current.refreshSeats();
      }
    } finally {
      setIsBooking(false);
    }
  };

  const handlePaymentProcess = async () => {
    try {
      setIsBooking(true);
      setError(null);

      const tempBookingStr = localStorage.getItem(TEMP_BOOKING_KEY);
      if (!tempBookingStr) {
        throw new Error('Không tìm thấy thông tin đặt vé. Vui lòng thử lại.');
      }

      const tempBooking = JSON.parse(tempBookingStr);

      // Navigate to VNPay payment page
      navigate(`/payment/vnpay/${tempBooking.bookingId}`);
      
    } catch (err: any) {
      console.error('Payment process error:', err);
      setError(err.message || 'Không thể xử lý thanh toán. Vui lòng thử lại sau.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Đặt vé xe</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin chuyến xe</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Bus className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Tuyến xe</p>
                      <p className="font-medium text-gray-800">{trip.route.name}</p>
                      <p className="text-sm text-gray-600">Mã chuyến: {trip.tripCode}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Ngày khởi hành</p>
                      <p className="font-medium text-gray-800">
                        {new Date(trip.departureDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Thời gian</p>
                      <p className="font-medium text-gray-800">
                        {trip.departureTime} - {trip.arrivalTime}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Điểm đón</p>
                      <p className="font-medium text-gray-800">
                        {trip.route.originStation.name }
                      </p>

                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Điểm trả</p>
                      <p className="font-medium text-gray-800">
                        {trip.route.destinationStation.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Bus className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Loại xe</p>
                      <p className="font-medium text-gray-800">{trip.bus.busType}</p>
                      <p className="text-sm text-gray-600">Biển số: {trip.bus.licensePlate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seat Selection Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Chọn ghế</h2>
              <p className="text-sm text-gray-600 mb-4">Chọn tối đa 5 ghế</p>

              <SeatSelection 
                ref={seatSelectionRef}
                tripId={trip._id}
                basePrice={trip.basePrice}
                onSeatsChange={(seats) => {
                  setCurrentSelectedSeats(seats);
                }}
                disabled={false}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin hành khách</h2>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={profile?.fullName || ''}
                    readOnly
                    placeholder="Họ và tên"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={profile?.phone || ''}
                    readOnly
                    placeholder="Số điện thoại"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile?.email || ''}
                    readOnly
                    placeholder="Email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Phương thức thanh toán</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="vnpay"
                    checked={paymentMethod === 'vnpay'}
                    onChange={() => setPaymentMethod('vnpay')}
                    className="text-blue-600"
                  />
                  <div>
                    <p className="text-sm text-gray-600">Thanh toán qua cổng VNPay</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Price Summary Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tổng quan giá vé</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Giá vé cơ bản:</span>
                  <span className="font-medium text-gray-800">
                    {trip.basePrice.toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Số lượng ghế:</span>
                  <span className="font-medium text-gray-800">{currentSelectedSeats.length}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium text-gray-800">Tổng tiền:</span>
                    <span className="font-bold text-blue-600">
                      {(trip.basePrice * currentSelectedSeats.length).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Seats Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ghế đã chọn</h3>
              <div className="flex flex-wrap gap-2">
                {currentSelectedSeats.map((seat: Seat) => (
                  <span key={seat.id} className="px-3 py-1 bg-green-100 text-green-800 rounded">
                    {seat.number}
                  </span>
                ))}
                {currentSelectedSeats.length === 0 && (
                  <span className="text-gray-500">Chưa chọn ghế</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {!showPaymentConfirmation ? (
              <button
                onClick={handleBookingConfirmation}
                disabled={currentSelectedSeats.length === 0 || isBooking}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isBooking ? 'Đang xử lý...' : 'Đặt vé'}
              </button>
            ) : (
              <button
                onClick={handlePaymentProcess}
                disabled={isBooking}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isBooking ? 'Đang xử lý...' : 'Tiếp tục thanh toán'}
              </button>
            )}
            
            {showPaymentConfirmation && !isBooking && (
              <button
                onClick={() => {
                  localStorage.removeItem(TEMP_BOOKING_KEY);
                  setShowPaymentConfirmation(false);
                  setCurrentSelectedSeats([]);
                }}
                className="w-full mt-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy và chọn lại ghế
              </button>
            )}

            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;