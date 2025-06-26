import React from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Ticket, Calendar, Clock, Ban, CheckCircle, ArrowRight } from 'lucide-react';
import { Booking } from '../types';
import { routes } from '../data';
import { useAppContext } from '../context/AppContext';

interface TicketCardProps {
  booking: Booking;
}

const TicketCard: React.FC<TicketCardProps> = ({ booking }) => {
  const { cancelBooking } = useAppContext();
  const route = routes.find((r) => r.id === booking.routeId);

  if (!route) return null;

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

  const isUpcoming = new Date(booking.travelDate) > new Date();
  
  const handleCancel = async () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy vé này không?')) {
      await cancelBooking(booking.id);
    }
  };

  return (
    <Link
      to={`/booking/${booking.id}`}
      className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Mã đơn hàng</h3>
          <p className="text-xl font-bold text-blue-600">{booking.id}</p>
          {booking.bookingCode && (
            <p className="text-sm text-gray-600 mt-2">
              Mã đặt vé: <span className="font-medium">{booking.bookingCode}</span>
            </p>
          )}
        </div>
        <div>
          {booking.status === 'confirmed' ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <CheckCircle className="h-4 w-4 mr-1" />
              Đã xác nhận
            </span>
          ) : booking.status === 'cancelled' ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              <Ban className="h-4 w-4 mr-1" />
              Đã hủy
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              <CheckCircle className="h-4 w-4 mr-1" />
              Đã hoàn thành
            </span>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <span className="text-blue-500 text-sm font-medium hover:text-blue-600">
          Xem chi tiết →
        </span>
      </div>
    </Link>
  );
};

export default TicketCard;