import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, MapPin, User, CreditCard, AlertCircle } from 'lucide-react';
import { Booking } from '../types';
import { getUserBookings } from '../services/bookingServices';
import { useAppContext } from '../context/AppContext';

const BookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        if (!user) {
          navigate('/auth/login');
          return;
        }
        const data = await getUserBookings(user._id);
        setBookings(data);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
        setError('Không thể tải danh sách đặt vé. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  const getBookingStatusInfo = (status: string): { label: string; color: string } => {
    const statuses: { [key: string]: { label: string; color: string } } = {
      confirmed: { label: 'Đã xác nhận', color: 'bg-green-100 text-green-800' },
      pending: { label: 'Đang chờ', color: 'bg-yellow-100 text-yellow-800' },
      cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
      completed: { label: 'Đã hoàn thành', color: 'bg-blue-100 text-blue-800' }
    };
    return statuses[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const getPaymentStatusInfo = (status: string): { label: string; color: string } => {
    const statuses: { [key: string]: { label: string; color: string } } = {
      paid: { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800' },
      unpaid: { label: 'Chưa thanh toán', color: 'bg-yellow-100 text-yellow-800' },
      failed: { label: 'Thanh toán thất bại', color: 'bg-red-100 text-red-800' },
      refunded: { label: 'Đã hoàn tiền', color: 'bg-blue-100 text-blue-800' }
    };
    return statuses[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const getPaymentMethodLabel = (method: string): string => {
    const methods: { [key: string]: string } = {
      cash: 'Tiền mặt',
      online: 'Thanh toán online',
      transfer: 'Chuyển khoản',
      card: 'Thẻ tín dụng/ghi nợ'
    };
    return methods[method] || method;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Đang tải danh sách đặt vé...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Danh sách đặt vé</h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Bạn chưa có đặt vé nào
            </h3>
            <p className="text-gray-600 mb-4">
              Hãy tìm và đặt vé cho chuyến đi của bạn ngay!
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tìm chuyến xe
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        Mã đặt vé: {booking.bookingCode}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        getBookingStatusInfo(booking.bookingStatus).color
                      }`}>
                        {getBookingStatusInfo(booking.bookingStatus).label}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        getPaymentStatusInfo(booking.paymentStatus).color
                      }`}>
                        {getPaymentStatusInfo(booking.paymentStatus).label}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      Ngày đặt: {new Date(booking.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      {booking.totalAmount.toLocaleString('vi-VN')} đ
                    </p>
                    <p className="text-sm text-gray-600">
                      {getPaymentMethodLabel(booking.paymentMethod)}
                    </p>
                  </div>
                </div>

                {/* Trip Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="flex items-center gap-3">
                    <Bus className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Chuyến xe</p>
                      <p className="font-medium text-gray-800">{booking.trip}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Điểm đón/trả</p>
                      <p className="font-medium text-gray-800">
                        {booking.pickupStation} - {booking.dropoffStation}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Số ghế</p>
                      <div className="flex flex-wrap gap-2">
                        {booking.seatNumbers.map((seat) => (
                          <span
                            key={seat}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium"
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Thanh toán</p>
                      <p className="font-medium text-gray-800">
                        {getPaymentMethodLabel(booking.paymentMethod)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => navigate(`/booking/${booking._id}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Xem chi tiết
                  </button>
                  {booking.bookingStatus === 'pending' && (
                    <button
                      onClick={() => navigate(`/payment/${booking._id}`)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Thanh toán
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage; 