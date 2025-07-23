import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { isAuthenticated } from '../utils/authUtils';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Route as RouteIcon, 
  Bus,
  AlertCircle
} from 'lucide-react';
import { Route, Trip, Station } from '../types';
import { getRouteById } from '../services/routeServices';
import { getTripsByRoute } from '../services/tripServices';
import { getStationById } from '../services/stationServices';
import BookingSteps from '../components/BookingSteps';
import { formatDate, formatDateSimple } from '../utils/dateUtils';

const RouteDetailPage: React.FC = () => {
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();
  const [route, setRoute] = useState<Route | null>(null);
  const [originStation, setOriginStation] = useState<Station | null>(null);
  const [destinationStation, setDestinationStation] = useState<Station | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRouteAndTrips = async () => {
      if (!routeId) {
        setError('ID tuyến đường không hợp lệ');
        setIsLoading(false);
        return;
      }

      try {
        const [routeData, tripsData] = await Promise.all([
          getRouteById(routeId),
          getTripsByRoute(routeId)
        ]);
        
        setRoute(routeData);
        setTrips(Array.isArray(tripsData) ? tripsData : []);

        // Fetch station details if we have station IDs
        if (routeData?.originStation && routeData?.destinationStation) {
          const [originStationData, destinationStationData] = await Promise.all([
            getStationById(routeData.originStation as string),
            getStationById(routeData.destinationStation as string)
          ]);
          
          setOriginStation(originStationData);
          setDestinationStation(destinationStationData);
        }
      } catch (err) {
        console.error('Failed to fetch route details:', err);
        if (err instanceof Error) {
          setError(`Lỗi: ${err.message}`);
        } else {
          setError('Không thể tải thông tin tuyến đường. Vui lòng thử lại sau.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRouteAndTrips();
  }, [routeId]);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''}`;
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };



  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Đang hoạt động', class: 'bg-green-100 text-green-800' },
      inactive: { label: 'Tạm ngưng', class: 'bg-red-100 text-red-800' },
      scheduled: { label: 'Đã lên lịch', class: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Hoàn thành', class: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'Đã hủy', class: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { label: status, class: 'bg-gray-100 text-gray-800' };

    return (
      <span className={`px-3 py-1 rounded text-sm font-medium ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const handleBookTrip = (trip: Trip) => {
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
    
    // Navigate directly to booking page with tripId as route parameter
    navigate(`/booking/${trip._id}`);
  };

  if (isLoading) {
    return (
      <div className="route-detail min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="route-detail__container container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Đang tải thông tin tuyến đường...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="route-detail min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="route-detail__container container mx-auto px-4">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error || 'Không tìm thấy tuyến đường'}</p>
            <button
              onClick={() => navigate('/routes')}
              className="route-detail__back-btn px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Quay lại danh sách tuyến đường
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="route-detail min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="route-detail__container container mx-auto px-4">
        <BookingSteps currentStep={2} />
        
        {/* Header */}
        <div className="route-detail__header mb-6">
          <button
            onClick={() => navigate('/routes')}
            className="route-detail__back-button flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="route-detail__back-icon h-5 w-5" />
            Quay lại danh sách tuyến đường
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="route-detail__info bg-white rounded-lg shadow-md p-6"
          >
            <div className="route-detail__info-wrapper flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="route-detail__main flex-1">
                <div className="route-detail__title flex items-center gap-3 mb-4">
                  <RouteIcon className="route-detail__icon h-8 w-8 text-blue-600" />
                  <h1 className="route-detail__name text-3xl font-bold text-gray-800">{route.name}</h1>
                  <span className="route-detail__code px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
                    {route.code}
                  </span>
                </div>

                <div className="route-detail__grid grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="route-detail__station flex items-center gap-3">
                    <MapPin className="route-detail__station-icon h-5 w-5 text-gray-500" />
                    <div>
                      <p className="route-detail__station-name text-gray-600">
                        <span className="font-medium">Điểm đi:</span> {originStation?.name || 'Đang tải...'}
                      </p>
                      <p className="route-detail__station-address text-sm text-gray-500">
                        {originStation?.address ? 
                          `${originStation.address.street || ''}, ${originStation.address.ward || ''}, ${originStation.address.district || ''}, ${originStation.address.city || ''}`.replace(/^,\s*|,\s*$|,\s*,/g, '').trim() || 'Chưa có địa chỉ chi tiết'
                          : 'Chưa có thông tin địa chỉ'}
                      </p>
                    </div>
                  </div>

                  <div className="route-detail__station flex items-center gap-3">
                    <MapPin className="route-detail__station-icon h-5 w-5 text-gray-500" />
                    <div>
                      <p className="route-detail__station-name text-gray-600">
                        <span className="font-medium">Điểm đến:</span> {destinationStation?.name || 'Đang tải...'}
                      </p>
                      <p className="route-detail__station-address text-sm text-gray-500">
                        {destinationStation?.address ? 
                          `${destinationStation.address.street || ''}, ${destinationStation.address.ward || ''}, ${destinationStation.address.district || ''}, ${destinationStation.address.city || ''}`.replace(/^,\s*|,\s*$|,\s*,/g, '').trim() || 'Chưa có địa chỉ chi tiết'
                          : 'Chưa có thông tin địa chỉ'}
                      </p>
                    </div>
                  </div>

                  <div className="route-detail__info-item flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <p className="text-gray-600">
                      <span className="font-medium">Thời gian dự kiến:</span>{' '}
                      {formatDuration(route.estimatedDuration)}
                    </p>
                  </div>

                  <div className="route-detail__info-item flex items-center gap-3">
                    <RouteIcon className="h-5 w-5 text-gray-500" />
                    <p className="text-gray-600">
                      <span className="font-medium">Khoảng cách:</span>{' '}
                      {route.distanceKm} km
                    </p>
                  </div>
                </div>
              </div>

              <div className="route-detail__status flex flex-col items-end gap-2">
                {getStatusBadge(route.status)}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trips Section */}
        <div className="route-detail__trips mb-6">
          <h2 className="route-detail__trips-title text-2xl font-bold text-gray-800 mb-4">
            Các chuyến xe ({trips.length})
          </h2>

          {trips.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="route-detail__no-trips bg-white rounded-lg shadow-md p-8 text-center"
            >
              <Bus className="route-detail__no-trips-icon h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="route-detail__no-trips-text text-gray-600">Hiện tại chưa có chuyến xe nào cho tuyến đường này.</p>
            </motion.div>
          ) : (
            <div className="route-detail__trips-list grid grid-cols-1 gap-4">
              {trips.map((trip, index) => (
                <motion.div
                  key={trip._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="route-detail__trip-card bg-white rounded-lg shadow-md p-6 hover:bg-gray-50 transition-all cursor-pointer"
                  whileHover={{ backgroundColor: "#f9fafb" }}
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
                            <div className="text-sm text-gray-500">{originStation?.name}</div>
                          </div>
                          
                          <div className="trip-card__duration flex items-center gap-2 px-3">
                            <div className="trip-card__duration-line h-px bg-gray-300 w-8"></div>
                            <div className="trip-card__duration-text text-sm text-gray-500">{formatDuration(route.estimatedDuration)}</div>
                            <div className="trip-card__duration-line h-px bg-gray-300 w-8"></div>
                          </div>
                          
                          <div className="trip-card__station text-center">
                            <div className="text-xl font-bold text-gray-800">{trip.arrivalTime}</div>
                            <div className="text-sm text-gray-500">{destinationStation?.name}</div>
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
                          trip.availableSeats > 10
                            ? 'bg-green-100 text-green-800'
                            : trip.availableSeats > 0
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {trip.availableSeats > 0
                            ? `Còn ${trip.availableSeats} chỗ`
                            : 'Hết chỗ'
                          }
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (trip.availableSeats > 0 && trip.status !== 'cancelled' && trip.status !== 'completed') {
                            handleBookTrip(trip);
                          }
                        }}
                        className={`trip-card__button px-6 py-3 rounded-lg font-medium transition-colors ${
                          trip.availableSeats > 0 && trip.status !== 'cancelled' && trip.status !== 'completed'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={trip.availableSeats === 0 || trip.status === 'cancelled' || trip.status === 'completed'}
                      >
                        {trip.availableSeats > 0 && trip.status !== 'cancelled' && trip.status !== 'completed' 
                          ? 'Chọn chuyến' 
                          : 'Hết chỗ'}
                      </button>
                    </div>
                  </div>

                  {/* Notes Section */}
                  {(trip.notes || index === 0) && (
                    <div className="trip-card__footer mt-4 pt-4 border-t border-gray-100">
                      <div className="trip-card__footer-content flex items-center justify-between text-sm">
                        <div className="trip-card__features flex items-center gap-4 text-gray-600">
                          <span>💡 Xác nhận tức thì</span>
                          <span>🎫 Đổi trả tận nơi</span>
                          <span>❌ Không cần thanh toán trước</span>
                        </div>
                        {trip.notes && (
                          <div className="trip-card__notes text-blue-600">
                            * {trip.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteDetailPage;
