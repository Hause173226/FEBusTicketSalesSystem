import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import SearchForm from '../components/SearchForm';
import { Route, Station } from '../types';
import { useAppContext } from '../context/AppContext';
import { getAllRoutes } from '../services/routeServices';

const RoutesPage: React.FC = () => {
  const { searchParams } = useAppContext();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    distanceRange: [0, 2000], // in km
    duration: [] as string[],
  });

  // Duration ranges in minutes
  const durationRanges = [
    '0-6 tiếng',
    '6-12 tiếng',
    '12-24 tiếng',
    'Trên 24 tiếng'
  ];



  useEffect(() => {
    const fetchRoutes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getAllRoutes();
        // Apply filters
        let filteredResults = result;
        
        // Filter by distance range
        filteredResults = filteredResults.filter((route: Route) => 
          route.distanceKm >= filters.distanceRange[0] && route.distanceKm <= filters.distanceRange[1]
        );
        
        // Filter by duration
        if (filters.duration.length > 0) {
          filteredResults = filteredResults.filter((route: Route) => {
            const durationInHours = route.estimatedDuration / 60; // Convert minutes to hours
            
            return filters.duration.some(timeRange => {
              if (timeRange === '0-6 tiếng') {
                return durationInHours <= 6;
              } else if (timeRange === '6-12 tiếng') {
                return durationInHours > 6 && durationInHours <= 12;
              } else if (timeRange === '12-24 tiếng') {
                return durationInHours > 12 && durationInHours <= 24;
              } else if (timeRange === 'Trên 24 tiếng') {
                return durationInHours > 24;
              }
              return false;
            });
          });
        }

        // Apply search filters if they exist
        if (searchParams.from && searchParams.to && searchParams.date) {
          filteredResults = filteredResults.filter((route: Route) => {
            // Add your search parameter filtering logic here
            return true; // Replace with actual filtering logic
          });
        }
        
        setRoutes(filteredResults);
      } catch (err) {
        setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
        console.error('Error fetching routes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutes();
  }, [searchParams, filters]);

  const handleDurationChange = (timeRange: string) => {
    setFilters(prev => {
      const newDurations = prev.duration.includes(timeRange)
        ? prev.duration.filter(t => t !== timeRange)
        : [...prev.duration, timeRange];
      
      return { ...prev, duration: newDurations };
    });
  };

  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setFilters(prev => ({
      ...prev,
      distanceRange: [0, value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      distanceRange: [0, 2000],
      duration: [],
    });
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} giờ ${remainingMinutes} phút`;
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
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters (Mobile Toggle) */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm flex items-center justify-center"
            >
              {showFilters ? (
                <>
                  <X className="h-5 w-5 mr-2" />
                  Ẩn bộ lọc
                </>
              ) : (
                <>
                  <Filter className="h-5 w-5 mr-2" />
                  Hiển thị bộ lọc
                </>
              )}
            </button>
          </div>
          
          {/* Filters (Sidebar) */}
          <motion.div
            className={`bg-white rounded-lg shadow-md p-6 h-fit ${showFilters ? 'block' : 'hidden'} md:block`}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ flex: '0 0 300px' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Bộ lọc tìm kiếm</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:underline"
              >
                Xóa bộ lọc
              </button>
            </div>
            
            {/* Distance Range Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">Khoảng cách</h4>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={filters.distanceRange[1]}
                onChange={handleDistanceChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>0 km</span>
                <span>{filters.distanceRange[1]} km</span>
              </div>
            </div>
            
            {/* Duration Filter */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Thời gian di chuyển</h4>
              <div className="space-y-2">
                {durationRanges.map((timeRange) => (
                  <label key={timeRange} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.duration.includes(timeRange)}
                      onChange={() => handleDurationChange(timeRange)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">{timeRange}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Search Results */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            ) : routes.length > 0 ? (
              <div className="space-y-4">
                {routes.map((route) => (
                  <div key={route._id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{route.originStation[0].name}</h3>
                        <p className="text-gray-600">Mã tuyến: {route.originStation[0].code}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-700">Điểm đi</h4>
                        {route.originStation.map((station: Station) => (
                          <div key={station._id} className="mt-2">
                            <p className="font-medium">{station.name}</p>
                            <p className="text-sm text-gray-600">
                              {station.address.street}, {station.address.ward}, {station.address.district}, {station.address.city}
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700">Điểm đến</h4>
                        {route.destinationStation.map((station: Station) => (
                          <div key={station._id} className="mt-2">
                            <p className="font-medium">{station.name}</p>
                            <p className="text-sm text-gray-600">
                              {station.address.street}, {station.address.ward}, {station.address.district}, {station.address.city}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Khoảng cách: {route.distanceKm} km</span>
                      <span>Thời gian dự kiến: {formatDuration(route.estimatedDuration)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700 text-center">
                {searchParams.from && searchParams.to ? 
                  'Không tìm thấy tuyến xe nào phù hợp với yêu cầu của bạn.' :
                  'Vui lòng nhập thông tin tìm kiếm để xem các tuyến xe.'
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutesPage;