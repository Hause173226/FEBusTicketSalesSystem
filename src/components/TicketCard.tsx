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
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200">
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div 
                className="cursor-pointer hover:text-blue-700 transition-colors duration-200"
                onClick={() => setIsModalOpen(true)}
                title="Click để xem chi tiết"
              >
                <h3 className="text-base font-semibold text-gray-800 mb-1 flex items-center">
                  <Ticket className="h-4 w-4 mr-2 text-blue-600" />
                  Mã đặt vé: {booking.bookingCode}
                </h3>
                <p className="text-xs text-blue-600 mb-2">👆 Click để xem chi tiết</p>
              </div>
              <div className="flex items-center text-gray-700 text-sm">
                <MapPin className="h-3 w-3 mr-1 text-green-600" />
                <span className="font-medium">{booking.pickupStation.name}</span>
                <ArrowRight className="h-3 w-3 mx-2 text-gray-400" />
                <MapPin className="h-3 w-3 mr-1 text-red-600" />
                <span className="font-medium">{booking.dropoffStation.name}</span>
              </div>
            </div>
            <div className="text-right ml-4">
              <p className="text-lg font-bold text-blue-600">{formatPrice(booking.totalAmount)}</p>
              <p className="text-xs text-gray-500">Ghế: {booking.seatNumbers.join(', ')}</p>
              <div className="mt-1">
                {getStatusDisplay(booking.bookingStatus, booking.paymentStatus)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex-shrink-0">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-semibold flex items-center">
                  <Ticket className="h-4 w-4 mr-2" />
                  Chi tiết vé xe khách
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors duration-200 p-1 hover:bg-blue-700 rounded"
                  title="Đóng modal"
                  aria-label="Đóng modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-3 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* Left Column */}
                <div className="space-y-3">
                  {/* Ticket Code */}
                  <div className="text-center border-b pb-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      Mã đặt vé: {booking.bookingCode}
                    </h3>
                    <div className="mt-2">
                      {getStatusDisplay(booking.bookingStatus, booking.paymentStatus)}
                    </div>
                  </div>
                  
                  {/* Route Information */}
                  <div className="bg-gray-50 rounded-lg p-2">
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center text-sm">
                      <MapPin className="h-3 w-3 mr-1 text-blue-600" />
                      Hành trình
                    </h4>
                    <div className="text-xs space-y-1">
                      <div>
                        <span className="text-gray-600">Điểm đón: </span>
                        <span className="font-medium">{booking.pickupStation.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Điểm trả: </span>
                        <span className="font-medium">{booking.dropoffStation.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trip Information */}
                  {booking.trip && (
                    <div className="bg-blue-50 rounded-lg p-2">
                      <h4 className="font-medium text-gray-800 mb-2 flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1 text-blue-600" />
                        Chuyến đi
                      </h4>
                      <div className="text-xs space-y-1">
                        <div>
                          <span className="text-gray-600">Ngày: </span>
                          <span className="font-medium">
                            {booking.trip.departureDate ? formatDate(booking.trip.departureDate) : 'Chưa xác định'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Giờ: </span>
                          <span className="font-medium">{booking.trip.departureTime || 'Chưa xác định'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  {/* Seat Information */}
                  <div className="bg-green-50 rounded-lg p-2">
                    <h4 className="font-medium text-gray-800 mb-1 text-sm">Thông tin ghế</h4>
                    <p className="font-medium text-gray-800">{booking.seatNumbers.join(', ')}</p>
                  </div>
                  
                  {/* Payment Information */}
                  <div className="bg-purple-50 rounded-lg p-2">
                    <h4 className="font-medium text-gray-800 mb-2 text-sm">Thanh toán</h4>
                    <div className="space-y-1">
                      <div>
                        <span className="text-xs text-gray-600">Tổng tiền: </span>
                        <span className="font-bold text-blue-600">{formatPrice(booking.totalAmount)}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Phương thức: </span>
                        <span className="text-xs font-medium">
                          {booking.paymentMethod === 'cash' ? 'Tiền mặt' : 
                           booking.paymentMethod === 'online' ? 'Trực tuyến' : 
                           'Chưa xác định'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="bg-gray-50 rounded-lg p-2">
                    <h4 className="font-medium text-gray-800 mb-1 text-sm">Chi tiết</h4>
                    <div className="text-xs">
                      <span className="text-gray-600">Ngày đặt: </span>
                      <span className="font-medium">{formatDate(booking.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-3 py-2 rounded-b-lg flex justify-end flex-shrink-0">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors duration-200"
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