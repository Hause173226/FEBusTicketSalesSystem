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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Ticket className="h-5 w-5 mr-2 text-blue-600" />
            {route.from} - {route.to}
          </h3>
          <div>
            {booking.status === 'confirmed' ? (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                Đã xác nhận
              </span>
            ) : booking.status === 'cancelled' ? (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center">
                <Ban className="h-4 w-4 mr-1" />
                Đã hủy
              </span>
            ) : (
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                Đã hoàn thành
              </span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Ngày đi</p>
              <p className="font-medium text-gray-800">{formatDate(booking.travelDate)}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Giờ khởi hành</p>
              <p className="font-medium text-gray-800">{route.departureTime}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Nhà xe</p>
          <p className="font-medium text-gray-800">{route.company} - {route.busType}</p>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Ghế</p>
          <div className="flex flex-wrap gap-2">
            {booking.seatIds.map((seatId, index) => (
              <span key={seatId} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                {`A${index + 1}`}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center border-t border-gray-200 pt-4">
          <div>
            <p className="text-sm text-gray-500">Tổng tiền</p>
            <p className="text-lg font-semibold text-blue-700">{formatPrice(booking.totalPrice)}</p>
          </div>
          
          <div className="flex space-x-2">
            {booking.status === 'confirmed' && isUpcoming && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors duration-200"
              >
                Hủy vé
              </button>
            )}
            
            <Link
              to={`/ticket/${booking.id}`}
              className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors duration-200 flex items-center"
            >
              Chi tiết
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;