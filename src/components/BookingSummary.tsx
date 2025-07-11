import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Ticket, Calendar, MapPin, Clock } from 'lucide-react';
import { Route, Seat, Trip } from '../types';
import { useAppContext } from '../context/AppContext';

interface BookingSummaryProps {
  route?: Route | Trip;
  selectedSeats: Seat[];
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ route, selectedSeats }) => {
  const { searchParams } = useAppContext();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return format(date, 'EEEE, dd/MM/yyyy', { locale: vi });
  };

  // Helper function to check if route is a Trip
  const isTrip = (routeData: Route | Trip | undefined): routeData is Trip => {
    return routeData !== undefined && 'departureDate' in routeData;
  };

  // Helper function to get station name safely
  const getStationName = (station: any): string => {
    if (typeof station === 'string') return station;
    if (station && typeof station === 'object' && station.name) return station.name;
    return 'Không xác định';
  };

  // Helper function to get station code safely
  const getStationCode = (station: any): string => {
    if (station && typeof station === 'object' && station.code) return station.code;
    return '';
  };

  if (!route) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">Đang tải thông tin...</p>
      </div>
    );
  }

  const trip = isTrip(route) ? route : null;
  const routeInfo = isTrip(route) ? route.route : route;
  
  // Calculate total price based on available data
  const basePrice = trip?.basePrice || selectedSeats.reduce((sum, seat) => sum + seat.price, 0) / selectedSeats.length || 0;
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Ticket className="h-5 w-5 mr-2 text-blue-600" />
        Chi tiết đặt vé
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <Calendar className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Ngày đi</p>
            <p className="font-medium text-gray-800">{formatDate(searchParams.date)}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <MapPin className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Từ</p>
            <p className="font-medium text-gray-800">
              {getStationName(routeInfo.originStation)}
            </p>
            <p className="text-sm text-gray-500 mt-2">Đến</p>
            <p className="font-medium text-gray-800">
              {getStationName(routeInfo.destinationStation)}
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Clock className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Giờ khởi hành</p>
            <p className="font-medium text-gray-800">
              {trip ? trip.departureDate : 'Chưa xác định'}
            </p>
          </div>
        </div>
        
        <div className="pt-2">
          <p className="text-sm text-gray-500 mb-1">Nhà xe</p>
          <p className="font-medium text-gray-800">
            {getStationName(routeInfo.originStation)}
          </p>
          <p className="text-sm text-gray-500">
            {getStationCode(routeInfo.originStation)}
          </p>
        </div>
        
        <div className="pt-2">
          <p className="text-sm text-gray-500 mb-1">Ghế đã chọn</p>
          <div className="flex flex-wrap gap-2">
            {selectedSeats.length > 0 ? (
              selectedSeats.map((seat) => (
                <span key={seat.id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                  {seat.number}
                </span>
              ))
            ) : (
              <p className="text-gray-500">Chưa chọn ghế</p>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Giá vé ({selectedSeats.length} ghế)</span>
            <span>{formatPrice(basePrice * selectedSeats.length)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Phí dịch vụ</span>
            <span>{formatPrice(0)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Tổng cộng</span>
              <span className="text-lg font-semibold text-blue-700">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;