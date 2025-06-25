import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bus, Calendar, Clock, MapPin } from 'lucide-react';
import { Trip } from '../types';
import { getTripById } from '../services/tripServices';
import { useAppContext } from '../context/AppContext';
import { createBooking } from '../services/bookingServices';
import paymentsServices from '../services/paymentsServices';
import PaymentMethods from '../components/PaymentMethods';

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, selectedTrip } = useAppContext();
  const [trip, setTrip] = useState<Trip | null>(selectedTrip);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank'>('cash');
  const [isLoading, setIsLoading] = useState(!selectedTrip);
  const [error, setError] = useState<string | null>(null);

  // Generate 40 seats (A1-A20, B1-B20)
  const allSeats = [
    ...Array.from({ length: 20 }, (_, i) => `A${i + 1}`),
    ...Array.from({ length: 20 }, (_, i) => `B${i + 1}`)
  ];

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
        setIsLoading(false);
      }
    };

    if (!user) {
      navigate('/auth/login');
      return;
    }

    if (!selectedTrip) {
      fetchTripDetails();
    }
  }, [id, user, navigate, selectedTrip]);

  const handleSeatSelection = (seat: string) => {
    setSelectedSeats(prev => {
      if (prev.includes(seat)) {
        return prev.filter(s => s !== seat);
      }
      // Limit selection to maximum 5 seats
      if (prev.length >= 5) {
        alert('Bạn chỉ có thể chọn tối đa 5 ghế');
        return prev;
      }
      return [...prev, seat];
    });
  };

  const handleBooking = async () => {
    if (!trip || !user) {
      alert('Không thể đặt vé. Vui lòng thử lại sau.');
      return;
    }

    if (selectedSeats.length === 0) {
      alert('Vui lòng chọn ít nhất 1 ghế');
      return;
    }

    // Store booking data in context and navigate to payment page
    navigate(`/payment?tripId=${trip._id}&seats=${selectedSeats.join(',')}&amount=${selectedSeats.length * trip.basePrice}`);
  };

  if (isLoading) {
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

              <div className="grid grid-cols-5 gap-4 mb-6">
                {allSeats.map(seatNumber => {
                  const isSelected = selectedSeats.includes(seatNumber);
                  const isBooked = false; // Since bookedSeats is not in the Trip type, we'll default to false

                  return (
                    <button
                      key={seatNumber}
                      onClick={() => !isBooked && handleSeatSelection(seatNumber)}
                      disabled={isBooked}
                      className={`
                        p-3 rounded-lg text-center transition-colors
                        ${isBooked
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-800 hover:bg-blue-50'
                        }
                      `}
                    >
                      {seatNumber}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
                  <span>Trống</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <span>Đã chọn</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 rounded"></div>
                  <span>Đã đặt</span>
                </div>
              </div>
            </div>

            {/* Customer Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin hành khách</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={user?.fullName || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={user?.phone || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
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
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod('cash')}
                    className="text-blue-600"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Tiền mặt</p>
                    <p className="text-sm text-gray-600">Thanh toán bằng tiền mặt khi lên xe</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={(e) => setPaymentMethod('bank')}
                    className="text-blue-600"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Chuyển khoản ngân hàng</p>
                    <p className="text-sm text-gray-600">Thanh toán qua tài khoản ngân hàng</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
                  <span className="font-medium text-gray-800">{selectedSeats.length}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium text-gray-800">Tổng tiền:</span>
                    <span className="font-bold text-blue-600">
                      {(trip.basePrice * selectedSeats.length).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Seats Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ghế đã chọn</h3>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map(seat => (
                  <span key={seat} className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                    {seat}
                  </span>
                ))}
                {selectedSeats.length === 0 && (
                  <span className="text-gray-500">Chưa chọn ghế</span>
                )}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleBooking}
              disabled={selectedSeats.length === 0}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;