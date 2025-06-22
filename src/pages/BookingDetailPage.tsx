import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Bus, 
  Users, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Ticket,
  User,

} from 'lucide-react';
import { Booking, Trip, Station, User as UserType } from '../types';
import { getBookingById } from '../services/bookingServices';
import { getTripById } from '../services/tripServices';
import { getStationById } from '../services/stationServices';

interface BookingDetails {
  booking: Booking;
  trip: Trip;
  customer: UserType;
  pickupStation: Station;
  dropoffStation: Station;
}

const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        if (!id) throw new Error('Booking ID is required');
        const bookingData = await getBookingById(id);
        const tripData = await getTripById(bookingData.trip);
        const pickupStationData = await getStationById(bookingData.pickupStation);
        const dropoffStationData = await getStationById(bookingData.dropoffStation);
        
        
        setBookingDetails({
          booking: bookingData,
          trip: tripData,
          customer: bookingData.customer as unknown as UserType,
          pickupStation: pickupStationData,
          dropoffStation: dropoffStationData
        });
      } catch (err) {
        console.error('Failed to fetch booking details:', err);
        setError('Không thể tải thông tin đặt vé. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id]);

  const getBookingStatusInfo = (status: string): { label: string; color: string; icon: JSX.Element } => {
    const statuses: { [key: string]: { label: string; color: string; icon: JSX.Element } } = {
      confirmed: { 
        label: 'Đã xác nhận', 
        color: 'bg-green-100 text-green-800', 
        icon: <CheckCircle className="h-5 w-5 text-green-600" />
      },
      pending: { 
        label: 'Đang chờ', 
        color: 'bg-yellow-100 text-yellow-800',
        icon: <AlertCircle className="h-5 w-5 text-yellow-600" />
      },
      cancelled: { 
        label: 'Đã hủy', 
        color: 'bg-red-100 text-red-800',
        icon: <XCircle className="h-5 w-5 text-red-600" />
      },
      completed: { 
        label: 'Đã hoàn thành', 
        color: 'bg-blue-100 text-blue-800',
        icon: <CheckCircle className="h-5 w-5 text-blue-600" />
      }
    };
    return statuses[status] || { 
      label: status, 
      color: 'bg-gray-100 text-gray-800',
      icon: <AlertCircle className="h-5 w-5 text-gray-600" />
    };
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
            <span className="ml-2 text-gray-600">Đang tải thông tin đặt vé...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">
            <p>{error || 'Không tìm thấy thông tin đặt vé'}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { booking, trip } = bookingDetails;
  const bookingStatusInfo = getBookingStatusInfo(booking.bookingStatus);
  const paymentStatusInfo = getPaymentStatusInfo(booking.paymentStatus);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Chi tiết đặt vé</h1>
            <p className="mt-1 text-gray-600">Mã đặt vé: {booking.bookingCode}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Status Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Ticket className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Trạng thái đặt vé</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${bookingStatusInfo.color}`}>
                    {bookingStatusInfo.icon}
                    {bookingStatusInfo.label}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${paymentStatusInfo.color}`}>
                    {paymentStatusInfo.label}
                  </span>
                </div>
              </div>

              {/* Trip Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Bus className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">{trip.route.name}</p>
                    <p className="text-sm text-gray-600">Mã chuyến: {trip.tripCode}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-gray-600">
                      {new Date(trip.departureDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div className="text-gray-600">
                    <p>Khởi hành: {trip.departureTime}</p>
                    <p>Đến nơi: {trip.arrivalTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div className="text-gray-600">
                    <p>Điểm đón: {bookingDetails.pickupStation?.name || 'N/A'}</p>
                    <p>Điểm trả: {bookingDetails.dropoffStation?.name || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">Thông tin hành khách</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Họ và tên</p>
                    <p className="font-medium text-gray-800">{bookingDetails.customer?.fullName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số điện thoại</p>
                    <p className="font-medium text-gray-800">{bookingDetails.customer?.phone || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-800">{bookingDetails.customer?.email || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Seat Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <Users className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">Thông tin ghế</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <p className="text-gray-600">Số ghế đã đặt:</p>
                  <div className="flex flex-wrap gap-2">
                    {booking.seatNumbers.map((seat) => (
                      <span 
                        key={seat}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bus className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-gray-600">
                      Loại xe: {trip.bus.busType}
                    </p>
                    <p className="text-sm text-gray-600">
                      Biển số: {trip.bus.licensePlate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Summary Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tổng quan thanh toán</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Giá vé cơ bản:</span>
                  <span className="font-medium text-gray-800">
                    {trip.basePrice.toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Số lượng ghế:</span>
                  <span className="font-medium text-gray-800">{booking.seatNumbers.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Phương thức:</span>
                  <span className="font-medium text-gray-800">
                    {getPaymentMethodLabel(booking.paymentMethod)}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium text-gray-800">Tổng tiền:</span>
                    <span className="font-bold text-blue-600">
                      {booking.totalAmount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Thao tác</h3>
              <div className="space-y-3">
                {booking.bookingStatus !== 'cancelled' && booking.bookingStatus !== 'completed' && (
                  <button
                      className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Hủy đặt vé
                  </button>
                )}
                <button 
                  onClick={() => window.print()}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  In vé
                </button>
              </div>
            </div>

            {/* Booking Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Thời gian</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ngày đặt:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(booking.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cập nhật lần cuối:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(booking.updatedAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Lưu ý</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Vui lòng có mặt tại điểm đón trước 30 phút</p>
                <p>• Mang theo giấy tờ tùy thân khi lên xe</p>
                <p>• Liên hệ hotline khi cần hỗ trợ: 1900 xxxx</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage; 