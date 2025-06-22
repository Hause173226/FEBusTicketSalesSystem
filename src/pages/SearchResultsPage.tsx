import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MapPin, Bus, Calendar, Users, ArrowRight, Search } from 'lucide-react';
import SearchForm from '../components/SearchForm';
import { Trip } from '../types';

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchResults, searchParams } = location.state || {};
  const trips = searchResults as Trip[] || [];

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''}`;
  };

  const handleBooking = (trip: Trip) => {
    navigate('/booking', { 
      state: { 
        trip,
        searchParams 
      }
    });
  };

  const getStationName = (stations: any[] | undefined): string => {
    if (!stations || !stations.length || !stations[0]) return 'N/A';
    return stations[0].name || 'N/A';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      {/* Search Form Section */}
      <section className="bg-blue-700 py-8">
        <div className="container mx-auto px-4">
          <SearchForm className="mb-0" />
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Kết quả tìm kiếm</h2>
            <div className="text-gray-600">
              {trips.length} chuyến xe được tìm thấy
            </div>
          </div>
          {searchParams && (
            <div className="mt-2 flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{searchParams.from} - {searchParams.to}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(searchParams.date).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          )}
        </div>

        {trips.length > 0 ? (
          <div className="space-y-4">
            {trips.map((trip) => (
              <motion.div
                key={trip._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {getStationName(trip.route?.originStation as any) } - {getStationName(trip.route?.destinationStation as any)}  
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {formatDuration(trip.route?.estimatedDuration || 0)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">Mã chuyến: {trip.tripCode || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-2xl font-bold text-blue-700">{formatPrice(trip.basePrice || 0)}</p>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        (trip.availableSeats || 0) > 10 
                          ? 'bg-green-100 text-green-800'
                          : (trip.availableSeats || 0) > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {(trip.availableSeats || 0) > 0 
                          ? `Còn ${trip.availableSeats} chỗ`
                          : 'Hết chỗ'
                        }
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="h-5 w-5" />
                      <span className="font-medium">Thời gian</span>
                    </div>
                    <div className="ml-7 space-y-2">
                      <p className="text-gray-600">
                        Khởi hành: <span className="font-medium">{trip.departureTime || 'N/A'}</span>
                      </p>
                      <p className="text-gray-600">
                        Đến nơi: <span className="font-medium">{trip.arrivalTime || 'N/A'}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Bus className="h-5 w-5" />
                      <span className="font-medium">Thông tin xe</span>
                    </div>
                    <div className="ml-7 space-y-2">
                      <p className="text-gray-600">
                        Loại xe: <span className="font-medium">{trip.bus?.busType || 'N/A'}</span>
                      </p>
                      <p className="text-gray-600">
                        Biển số: <span className="font-medium">{trip.bus?.licensePlate || 'N/A'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="h-5 w-5" />
                      <span className="font-medium">Sức chứa</span>
                    </div>
                    <div className="ml-7 space-y-2">
                      <p className="text-gray-600">
                        Tổng số ghế: <span className="font-medium">{trip.bus?.capacity || trip.availableSeats || 0} chỗ</span>
                      </p>
                      <p className="text-gray-600">
                        Còn trống: <span className="font-medium">{trip.availableSeats || 0} chỗ</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      (trip.availableSeats || 0) > 0
                        ? 'bg-blue-700 text-white hover:bg-blue-800'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    onClick={() => (trip.availableSeats || 0) > 0 && handleBooking(trip)}
                    disabled={(trip.availableSeats || 0) === 0}
                  >
                    Đặt vé
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-8 text-center"
          >
            <div className="mb-4">
              <span className="inline-block p-3 bg-gray-100 rounded-full">
                <Search className="h-6 w-6 text-gray-400" />
              </span>
            </div>
            <p className="text-gray-700 text-lg font-medium">
              Không tìm thấy chuyến xe nào phù hợp
            </p>
            <p className="text-gray-600 mt-2">
              Vui lòng thử lại với các tiêu chí tìm kiếm khác
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage; 