import React from 'react';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Ticket, Calendar, Clock, Ban, CheckCircle, ArrowRight, MapPin } from 'lucide-react';
import { Booking } from '../types';

interface TicketCardProps {
  booking: Booking;
}

const TicketCard: React.FC<TicketCardProps> = ({ booking }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'EEEE, dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusDisplay = (bookingStatus: string, paymentStatus: string) => {
    if (bookingStatus === 'cancelled') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <Ban className="h-4 w-4 mr-1" />
          Đã hủy
        </span>
      );
    }
    
    if (paymentStatus === 'paid') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-4 w-4 mr-1" />
          Đã thanh toán
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
    
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
        <Clock className="h-4 w-4 mr-1" />
        Chờ xác nhận
      </span>
    );
  };

  return (
    <div className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            <Ticket className="inline h-5 w-5 mr-2" />
            Mã đặt vé: {booking.bookingCode}
          </h3>
          <p className="text-sm text-gray-600">
            Mã booking: <span className="font-medium">{booking._id}</span>
          </p>
        </div>
        <div>
          {getStatusDisplay(booking.bookingStatus, booking.paymentStatus)}
        </div>
      </div>

      {/* Route Information */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-700">
            <MapPin className="h-4 w-4 mr-1 text-green-600" />
            <span className="font-medium">{booking.pickupStation.name}</span>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
          <div className="flex items-center text-gray-700">
            <MapPin className="h-4 w-4 mr-1 text-red-600" />
            <span className="font-medium">{booking.dropoffStation.name}</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 mt-2">
          <p>Điểm đón: {booking.pickupStation.address.street}, {booking.pickupStation.address.ward}, {booking.pickupStation.address.district}, {booking.pickupStation.address.city}</p>
          <p>Điểm trả: {booking.dropoffStation.address.street}, {booking.dropoffStation.address.ward}, {booking.dropoffStation.address.district}, {booking.dropoffStation.address.city}</p>
        </div>
      </div>

      {/* Trip Information */}
      {booking.trip ? (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            <Calendar className="inline h-4 w-4 mr-1" />
            Ngày khởi hành: {formatDate(booking.trip.departureTime)}
          </p>
          <p className="text-sm text-gray-600">
            <Clock className="inline h-4 w-4 mr-1" />
            Giờ khởi hành: {new Date(booking.trip.departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-yellow-50 rounded-md">
          <p className="text-sm text-yellow-700">Thông tin chuyến đi chưa được cập nhật</p>
        </div>
      )}

      {/* Seat and Payment Information */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-600">Ghế đã chọn:</p>
          <p className="font-medium text-gray-800">{booking.seatNumbers.join(', ')}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Tổng tiền:</p>
          <p className="text-xl font-bold text-blue-600">{formatPrice(booking.totalAmount)}</p>
        </div>
      </div>

      {/* Booking Date */}
      <div className="text-sm text-gray-500 border-t pt-3">
        <p>Ngày đặt: {formatDate(booking.createdAt)}</p>
        <p>Phương thức thanh toán: {booking.paymentMethod === 'cash' ? 'Tiền mặt' : booking.paymentMethod}</p>
      </div>
    </div>
  );
};

export default TicketCard;