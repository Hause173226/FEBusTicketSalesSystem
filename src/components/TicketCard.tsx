import React, { useState } from 'react';
import { Ticket, Calendar, Clock, Ban, CheckCircle, ArrowRight, MapPin, X } from 'lucide-react';
import { Booking } from '../types';
import { formatDate, formatPrice } from '../utils/dateUtils';

interface TicketCardProps {
  booking: Booking;
}

const TicketCard: React.FC<TicketCardProps> = ({ booking }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Chỉ hiển thị những vé đã thanh toán thành công
  const isPaymentSuccessful = booking.paymentStatus === 'paid' || booking.paymentStatus === 'success';
  
  // Nếu chưa thanh toán thành công thì không hiển thị
  if (!isPaymentSuccessful) {
    return null;
  }

  const getStatusDisplay = (bookingStatus: string, paymentStatus: string) => {
    // Ưu tiên hiển thị trạng thái hủy trước
    if (bookingStatus === 'cancelled') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <Ban className="h-4 w-4 mr-1" />
          Đã hủy
        </span>
      );
    }
    
    // Kiểm tra trạng thái thanh toán
    if (paymentStatus === 'paid' || paymentStatus === 'success') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-4 w-4 mr-1" />
          Đã thanh toán
        </span>
      );
    }
    
    if (paymentStatus === 'pending' || bookingStatus === 'pending') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <Clock className="h-4 w-4 mr-1" />
          Chờ thanh toán
        </span>
      );
    }
    
    if (bookingStatus === 'confirmed') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          <CheckCircle className="h-4 w-4 mr-1" />
          Đã xác nhận
        </span>
      );
    }

    // Trạng thái thanh toán thất bại
    if (paymentStatus === 'failed' || paymentStatus === 'error') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <Ban className="h-4 w-4 mr-1" />
          Thanh toán thất bại
        </span>
      );
    }
    
    // Mặc định
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        <Clock className="h-4 w-4 mr-1" />
        Chờ xử lý
      </span>
    );
  };

  return (
    <>
      {/* Ticket Card */}
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div 
                className="cursor-pointer hover:text-blue-700 transition-all duration-200 border border-transparent hover:border-blue-300 rounded-md p-2 -m-2 hover:bg-blue-50"
                onClick={() => setIsModalOpen(true)}
                title="Click để xem chi tiết"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-1 flex items-center">
                  <Ticket className="h-5 w-5 mr-2 text-blue-600" />
                  Mã đặt vé: {booking.bookingCode}
                </h3>
                <p className="text-xs text-blue-600 opacity-75 font-medium">👆 Click để xem chi tiết</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-700">
                  <MapPin className="h-4 w-4 mr-1 text-green-600" />
                  <span className="font-medium">{booking.pickupStation.name}</span>
                  <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                  <MapPin className="h-4 w-4 mr-1 text-red-600" />
                  <span className="font-medium">{booking.dropoffStation.name}</span>
                </div>
                <div className="text-right ml-4">
                  <p className="text-lg font-bold text-blue-600">{formatPrice(booking.totalAmount)}</p>
                  <p className="text-sm text-gray-500">Ghế: {booking.seatNumbers.join(', ')}</p>
                  {/* Quick status indicator */}
                  <p className="text-xs text-gray-400 mt-1">
                    🟢 Đã thanh toán
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center ml-4">
              {getStatusDisplay(booking.bookingStatus, booking.paymentStatus)}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full h-auto max-h-screen overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg flex-shrink-0">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center">
                  <Ticket className="h-5 w-5 mr-2" />
                  Chi tiết vé xe khách
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors duration-200 p-1 hover:bg-blue-700 rounded"
                  title="Đóng modal"
                  aria-label="Đóng modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Ticket Code */}
                  <div className="text-center border-b pb-3">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      Mã đặt vé: {booking.bookingCode}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">
                      Mã booking: {booking._id}
                    </p>
                    <div className="flex justify-center">
                      {getStatusDisplay(booking.bookingStatus, booking.paymentStatus)}
                    </div>
                  </div>
                  
                  {/* Route Information */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-1 text-blue-600" />
                      Thông tin hành trình
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Điểm đón</p>
                        <p className="font-medium text-gray-800 text-sm">{booking.pickupStation.name}</p>
                        <p className="text-xs text-gray-500">
                          {booking.pickupStation.address.street}, {booking.pickupStation.address.ward}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Điểm trả</p>
                        <p className="font-medium text-gray-800 text-sm">{booking.dropoffStation.name}</p>
                        <p className="text-xs text-gray-500">
                          {booking.dropoffStation.address.street}, {booking.dropoffStation.address.ward}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Trip Information */}
                  {booking.trip ? (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1 text-blue-600" />
                        Thông tin chuyến đi
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-600">Ngày khởi hành</p>
                            <p className="font-medium text-gray-800 text-sm">
                              {booking.trip.departureDate ? formatDate(booking.trip.departureDate) : 'Chưa xác định'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-600">Giờ khởi hành</p>
                            <p className="font-medium text-gray-800 text-sm">{booking.trip.departureTime || 'Chưa xác định'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 rounded-lg p-3">
                      <p className="text-xs text-yellow-700">Thông tin chuyến đi chưa được cập nhật</p>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Seat and Payment Information */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-green-50 rounded-lg p-3">
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm">Thông tin ghế</h4>
                      <div>
                        <p className="text-xs text-gray-600">Ghế đã chọn</p>
                        <p className="font-medium text-gray-800 text-base">{booking.seatNumbers.join(', ')}</p>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-3">
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm">Thông tin thanh toán</h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-600">Tổng tiền</p>
                          <p className="font-bold text-blue-600 text-lg">{formatPrice(booking.totalAmount)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Phương thức thanh toán</p>
                          <p className="font-medium text-gray-800 text-sm">
                            {booking.paymentMethod === 'cash' ? 'Tiền mặt' : 
                             booking.paymentMethod === 'online' ? 'Trực tuyến' : 
                             booking.paymentMethod || 'Chưa xác định'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Trạng thái thanh toán</p>
                          <div className="mt-1">
                            {getStatusDisplay(booking.bookingStatus, booking.paymentStatus)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Status Details */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-semibold text-gray-800 mb-1 text-sm">Chi tiết trạng thái</h4>
                    <div className="text-xs">
                      <p className="text-green-700">
                        ✅ <strong>Đã thanh toán thành công</strong> - Vé của bạn đã được xác nhận
                      </p>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Chi tiết đặt vé</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-600">Ngày đặt</p>
                        <p className="font-medium text-gray-800 text-sm">{formatDate(booking.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Trạng thái vé</p>
                        <div className="mt-1">
                          {getStatusDisplay(booking.bookingStatus, booking.paymentStatus)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-4 py-3 rounded-b-lg flex justify-end flex-shrink-0">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TicketCard;