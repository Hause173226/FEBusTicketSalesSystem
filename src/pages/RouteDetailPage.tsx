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
  Calendar,
  DollarSign,
  Users,
  AlertCircle
} from 'lucide-react';
import { Route, Trip, Station } from '../types';
import { getRouteById } from '../services/routeServices';
import { getTripsByRoute } from '../services/tripServices';
import { getStationById } from '../services/stationServices';
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

  const formatDateTime = (date: string, time: string): string => {
    const tripDate = new Date(date);
    return `${tripDate.toLocaleDateString('vi-VN')} - ${time}`;
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
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
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
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error || 'Không tìm thấy tuyến đường'}</p>
            <button
              onClick={() => navigate('/routes')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Quay lại danh sách tuyến đường
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/routes')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Quay lại danh sách tuyến đường
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <RouteIcon className="h-8 w-8 text-blue-600" />
                  <h1 className="text-3xl font-bold text-gray-800">{route.name}</h1>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
                    {route.code}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium">Điểm đi:</span> {originStation?.name || 'Đang tải...'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {originStation?.address ? 
                          `${originStation.address.street || ''}, ${originStation.address.ward || ''}, ${originStation.address.district || ''}, ${originStation.address.city || ''}`.replace(/^,\s*|,\s*$|,\s*,/g, '').trim() || 'Chưa có địa chỉ chi tiết'
                          : 'Chưa có thông tin địa chỉ'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium">Điểm đến:</span> {destinationStation?.name || 'Đang tải...'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {destinationStation?.address ? 
                          `${destinationStation.address.street || ''}, ${destinationStation.address.ward || ''}, ${destinationStation.address.district || ''}, ${destinationStation.address.city || ''}`.replace(/^,\s*|,\s*$|,\s*,/g, '').trim() || 'Chưa có địa chỉ chi tiết'
                          : 'Chưa có thông tin địa chỉ'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <p className="text-gray-600">
                      <span className="font-medium">Thời gian dự kiến:</span>{' '}
                      {formatDuration(route.estimatedDuration)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <RouteIcon className="h-5 w-5 text-gray-500" />
                    <p className="text-gray-600">
                      <span className="font-medium">Khoảng cách:</span>{' '}
                      {route.distanceKm} km
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(route.status)}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trips Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Các chuyến xe ({trips.length})
          </h2>

          {trips.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-8 text-center"
            >
              <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Hiện tại chưa có chuyến xe nào cho tuyến đường này.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {trips.map((trip, index) => (
                <motion.div
                  key={trip._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Bus className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-800">
                          Chuyến {trip.tripCode}
                        </h3>
                        {getStatusBadge(trip.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Ngày khởi hành</p>
                            <p className="font-medium">
                              {formatDateTime(trip.departureDate, trip.departureTime)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Giờ đến dự kiến</p>
                            <p className="font-medium">{trip.arrivalTime}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Giá vé</p>
                            <p className="font-medium text-blue-600">
                              {formatPrice(trip.basePrice)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Bus className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Loại xe</p>
                            <p className="font-medium">{trip.bus?.busType || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Ghế trống</p>
                            <p className="font-medium">
                              {trip.availableSeats || 0}/{trip.bus?.seatCount || 0}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Biển số xe</p>
                            <p className="font-medium">{trip.bus?.licensePlate || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      {trip.notes && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-sm text-yellow-800">
                            <span className="font-medium">Ghi chú:</span> {trip.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {trip.discountPercentage > 0 && (
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded">
                          Giảm {trip.discountPercentage}%
                        </span>
                      )}
                      
                      {/* Booking button */}
                      {trip.status !== 'cancelled' && trip.status !== 'completed' && (
                        <button
                          onClick={() => handleBookTrip(trip)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Chọn chuyến
                        </button>
                      )}
                    </div>
                  </div>
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
