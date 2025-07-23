import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bus, Calendar, Clock, MapPin } from 'lucide-react';
import { Trip, Seat } from '../types';
import { getTripById } from '../services/tripServices';
import { useAppContext } from '../context/AppContext';
import SeatSelection, { SeatSelectionRef } from '../components/SeatSelection';
import { createBooking } from '../services/bookingServices';
import BookingSteps from '../components/BookingSteps';

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
      // Type guards to ensure stations exist and are Station objects
      const originStation = trip.route.originStation;
      const destinationStation = trip.route.destinationStation;
      
      if (!originStation || !destinationStation) {
        throw new Error('Thông tin tuyến đường không đầy đủ');
      }
      
      // Handle both string and Station object cases
      const pickupStationId = typeof originStation === 'string' ? originStation : originStation._id;
      const dropoffStationId = typeof destinationStation === 'string' ? destinationStation : destinationStation._id;
      
      const bookingData = {
        trip: trip._id,
        customer: profile._id,
        pickupStation: pickupStationId,
        dropoffStation: dropoffStationId,
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
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <BookingSteps currentStep={3} />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Đặt vé xe</h1>
          <p className="text-gray-600 mt-2">Vui lòng kiểm tra thông tin và chọn ghế phù hợp</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Trip Info Card */}
          <div className="col-span-12 lg:col-span-3 lg:order-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-blue-800">Thông tin chuyến xe</h2>
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {trip.tripCode}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Bus className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">Tuyến xe</p>
                      <p className="text-sm font-medium text-gray-900">{trip.route.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">Ngày khởi hành</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(trip.departureDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">Thời gian</p>
                      <p className="text-sm font-medium text-gray-900">
                        {trip.departureTime} - {trip.arrivalTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">Điểm đón</p>
                      <p className="text-sm font-medium text-gray-900">
                        {trip.route.originStation 
                          ? (typeof trip.route.originStation === 'string' 
                              ? trip.route.originStation 
                              : trip.route.originStation.name)
                          : 'Chưa có thông tin'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">Điểm trả</p>
                      <p className="text-sm font-medium text-gray-900">
                        {trip.route.destinationStation
                          ? (typeof trip.route.destinationStation === 'string' 
                              ? trip.route.destinationStation 
                              : trip.route.destinationStation.name)
                          : 'Chưa có thông tin'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Bus className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">Loại xe</p>
                      <p className="text-sm font-medium text-gray-900">{trip.bus.busType}</p>
                      <p className="text-xs text-gray-500">Biển số: {trip.bus.licensePlate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Seat Selection */}
          <div className="col-span-12 lg:col-span-6 lg:order-2">
            {/* Seat Selection Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-blue-800">Chọn ghế</h2>
                    <p className="text-xs text-blue-600 mt-1">Vui lòng chọn tối đa 5 ghế</p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-center w-full">
                  <div className="w-full max-w-[340px]"> {/* Match width with sidebar and button */}
                    <SeatSelection 
                      ref={seatSelectionRef}
                      tripId={trip._id}
                      basePrice={trip.basePrice}
                      busType={trip.bus?.busType?.toLowerCase()}
                      onSeatsChange={(seats) => {
                        setCurrentSelectedSeats(seats);
                      }}
                      disabled={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3 lg:order-3 space-y-4">
            {/* Customer Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                <h2 className="text-base font-semibold text-blue-800">Thông tin hành khách</h2>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={profile?.fullName || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-200 rounded bg-gray-50 text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={profile?.phone || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-200 rounded bg-gray-50 text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile?.email || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-200 rounded bg-gray-50 text-sm text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                <h2 className="text-base font-semibold text-blue-800">Phương thức thanh toán</h2>
              </div>
              <div className="p-4">
                <label className="flex items-center gap-3 p-3 border border-blue-100 rounded bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="vnpay"
                    checked={paymentMethod === 'vnpay'}
                    onChange={() => setPaymentMethod('vnpay')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Thanh toán qua VNPay</p>
                    <p className="text-xs text-blue-700">An toàn và bảo mật</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Price Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                <h2 className="text-base font-semibold text-blue-800">Tổng quan giá vé</h2>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Giá vé cơ bản</span>
                  <span className="text-sm font-medium text-gray-900">
                    {trip.basePrice.toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Số lượng ghế</span>
                  <span className="text-sm font-medium text-gray-900">{currentSelectedSeats.length}</span>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">Tổng tiền</span>
                    <span className="text-lg font-bold text-blue-600">
                      {(trip.basePrice * currentSelectedSeats.length).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Seats Display - moved here */}
            {currentSelectedSeats.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-lg mt-2">
                <span className="text-sm font-medium text-blue-700">Đã chọn:</span>
                {currentSelectedSeats.map((seat: Seat) => (
                  <span key={seat.id} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                    {seat.number}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {!showPaymentConfirmation ? (
                <button
                  onClick={handleBookingConfirmation}
                  disabled={currentSelectedSeats.length === 0 || isBooking}
                  className="w-full px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isBooking ? 'Đang xử lý...' : 'Đặt vé'}
                </button>
              ) : (
                <>
                  <button
                    onClick={handlePaymentProcess}
                    disabled={isBooking}
                    className="w-full px-6 py-3 bg-green-600 text-white text-base font-medium rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isBooking ? 'Đang xử lý...' : 'Tiếp tục thanh toán'}
                  </button>
                  
                  <button
                    onClick={() => {
                      localStorage.removeItem(TEMP_BOOKING_KEY);
                      setShowPaymentConfirmation(false);
                      setCurrentSelectedSeats([]);
                    }}
                    className="w-full px-6 py-3 bg-gray-100 text-gray-700 text-base font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Hủy và chọn lại ghế
                  </button>
                </>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;