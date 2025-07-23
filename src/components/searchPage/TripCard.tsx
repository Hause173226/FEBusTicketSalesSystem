import React from 'react';
import { motion } from 'framer-motion';
import { Bus } from 'lucide-react';
import { Trip } from '../../types';
import { isAuthenticated } from '../../utils/authUtils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { formatDate } from '../../utils/dateUtils';

interface TripCardProps {
  trip: Trip;
  route: any;
  index: number;
  searchParams: any;
  formatPrice: (price: number) => string;
  formatDuration: (minutes: number) => string;
  getStationName: (station: any) => string;
  onBooking: (trip: Trip) => void;
}

const TripCard: React.FC<TripCardProps> = ({
  trip,
  route,
  index,
  searchParams,
  formatPrice,
  formatDuration,
  getStationName,
  onBooking
}) => {
  const navigate = useNavigate();
  
  
  // Cải thiện logic kiểm tra
  const availableSeats = trip.availableSeats ?? 0;
  const isAvailable = availableSeats > 0;

  const handleBooking = () => {
    if (!isAuthenticated()) {
      toast.error('Vui lòng đăng nhập để đặt vé!', {
        duration: 3000,
        style: {
          background: '#ef4444',
          color: 'white',
        },
      });
      navigate('/login');
      return;
    }
    onBooking(trip);
  };
  
  return (
    <motion.div
      className="trip-card p-6 hover:bg-gray-50 transition-colors cursor-pointer"
      whileHover={{ backgroundColor: "#f9fafb" }}
      onClick={() => isAvailable && handleBooking()}
    >
      <div className="trip-card__content flex items-center justify-between">
        {/* Trip Info Left */}
        <div className="trip-card__info flex items-center gap-6">
          {/* Bus Image/Icon */}
          <div className="trip-card__icon w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
            <Bus className="h-8 w-8 text-blue-600" />
          </div>
          
          {/* Time & Route */}
          <div className="trip-card__details">
            <div className="trip-card__route flex items-center gap-4 mb-2">
              <div className="trip-card__station text-center">
                <div className="text-xl font-bold text-gray-800">{trip.departureTime}</div>
                <div className="text-sm text-gray-500">{getStationName(route?.originStation)}</div>
              </div>
              
              <div className="trip-card__duration flex items-center gap-2 px-3">
                <div className="h-px bg-gray-300 w-8"></div>
                <div className="text-sm text-gray-500">{formatDuration(route?.estimatedDuration || 0)}</div>
                <div className="h-px bg-gray-300 w-8"></div>
              </div>
              
              <div className="trip-card__station text-center">
                <div className="text-xl font-bold text-gray-800">{trip.arrivalTime}</div>
                <div className="text-sm text-gray-500">{getStationName(route?.destinationStation)}</div>
              </div>
            </div>
            
            <div className="trip-card__bus-info flex items-center gap-4 text-sm text-gray-600">
              <div className="trip-card__bus-type flex items-center gap-1">
                <Bus className="h-4 w-4" />
                <span>{trip.bus?.busType || 'N/A'}</span>
              </div>
              <div className="trip-card__license flex items-center gap-1">
                <span>Biển số: {trip.bus?.licensePlate || 'N/A'}</span>
              </div>
              <div className="trip-card__seats flex items-center gap-1">
                              <span>Ngày đi: {trip.departureDate ? formatDate(trip.departureDate, 'dd/MM/yyyy') : 'N/A'}</span>
                            </div>
                            <div className="trip-card__seats flex items-center gap-1">
                              <span>Ngày đến: {(() => {
                                if (trip.arrivalDate) {
                                  return formatDate(trip.arrivalDate, 'dd/MM/yyyy');
                                }
                                if (trip.departureDate && trip.departureTime && route.estimatedDuration) {
                                  // Combine date and time
                                  const [hour, minute] = trip.departureTime.split(':').map(Number);
                                  const departure = new Date(trip.departureDate);
                                  departure.setHours(hour, minute, 0, 0);
                                  // Add estimated duration (minutes)
                                  const arrival = new Date(departure.getTime() + route.estimatedDuration * 60000);
                                  return formatDate(arrival.toISOString(), 'dd/MM/yyyy');
                                }
                                return 'N/A';
                              })()}</span>
                            </div>
            </div>
          </div>
        </div>

        {/* Price & Book Button */}
        <div className="trip-card__booking text-right">
          <div className="mb-4">
            <div className="trip-card__price text-2xl font-bold text-blue-600 mb-1">
              {formatPrice(trip.basePrice)}
            </div>
            <div className={`trip-card__seats inline-block px-3 py-1 rounded-full text-sm font-medium ${
              availableSeats > 10
                ? 'bg-green-100 text-green-800'
                : availableSeats > 0
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }`}>
              {isAvailable
                ? `Còn ${availableSeats} chỗ`
                : 'Hết chỗ'
              }
            </div>
          </div>
          
          <button
            className={`trip-card__btn px-6 py-3 rounded-lg font-medium transition-colors ${
              isAvailable
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isAvailable}
            onClick={(e) => {
              e.stopPropagation();
              if (isAvailable) handleBooking();
            }}
          >
            {isAvailable ? 'Chọn chuyến' : 'Hết chỗ'}
          </button>
        </div>
      </div>

      {/* Additional Info */}
      {index === 0 && (
        <div className="trip-card__footer mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="trip-card__features flex items-center gap-4 text-gray-600">
              <span>💡 Xác nhận tức thì</span>
              <span>🎫 Đổn trả tận nơi</span>
              <span>❌ Không cần thanh toán trước</span>
            </div>
            <div className="trip-card__route-info text-blue-600">
              * Vé chặng chiều {trip.departureTime} {new Date(searchParams?.date).toLocaleDateString('vi-VN')} {searchParams?.from} - {searchParams?.to}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TripCard;
