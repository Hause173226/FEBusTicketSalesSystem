import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchForm from '../components/SearchForm';
import { Trip } from '../types';

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const searchResults = location.state?.searchResults as Trip[] || [];

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="pt-16 pb-12">
      {/* Search Form Section */}
      <section className="bg-blue-700 py-12">
        <div className="container mx-auto px-4">
          <SearchForm className="mb-0" />
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Kết quả tìm kiếm</h2>
          <p className="text-gray-600 mt-2">
            {searchResults.length} chuyến xe được tìm thấy
          </p>
        </div>

        {searchResults.length > 0 ? (
          <div className="space-y-4">
            {searchResults.map((trip) => (
              <motion.div
                key={trip._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {trip.route.originStation[0].name} - {trip.route.destinationStation[0].name}
                    </h3>
                    <p className="text-gray-600">Mã chuyến: {trip.tripCode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-700">{formatPrice(trip.basePrice)}</p>
                    <p className="text-sm text-gray-500">
                      {trip.availableSeats > 0 
                        ? `Còn ${trip.availableSeats} chỗ`
                        : 'Hết chỗ'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Thông tin chuyến đi</h4>
                    <div className="mt-2 space-y-2">
                      <p className="text-gray-600">
                        Giờ đi: <span className="font-medium">{trip.departureTime}</span>
                      </p>
                      <p className="text-gray-600">
                        Giờ đến: <span className="font-medium">{trip.arrivalTime}</span>
                      </p>
                      <p className="text-gray-600">
                        Trạng thái: <span className="font-medium capitalize">{trip.status}</span>
                      </p>
                      
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700">Thông tin xe</h4>
                    <div className="mt-2 space-y-2">

                      <p className="text-gray-600">
                        Loại xe: <span className="font-medium">{trip.bus.busType}</span>
                      </p>
                      <p className="text-gray-600">
                        Biển số: <span className="font-medium">{trip.bus.licensePlate}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                    onClick={() => {
                      // TODO: Implement booking logic
                      console.log('Book trip:', trip._id);
                    }}
                  >
                    Đặt vé
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-700 text-lg">
              Không tìm thấy chuyến xe nào phù hợp với yêu cầu của bạn.
            </p>
            <p className="text-gray-600 mt-2">
              Vui lòng thử lại với các tiêu chí tìm kiếm khác.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage; 