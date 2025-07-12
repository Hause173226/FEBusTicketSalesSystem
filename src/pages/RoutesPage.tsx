import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Route as RouteIcon, MapPin, Search, CalendarDays } from 'lucide-react';
import { Route } from '../types';
import { getAllRoutes } from '../services/routeServices';

const RoutesPage: React.FC = () => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const data = await getAllRoutes();
        const activeRoutes = data.filter(route => route.status === 'active');
        // Sort by createdAt initially
        const sortedRoutes = activeRoutes.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setRoutes(sortedRoutes);
        setFilteredRoutes(sortedRoutes);
      } catch (err) {
        console.error('Failed to fetch routes:', err);
        setError('Không thể tải danh sách tuyến đường. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    const filtered = routes.filter(route => {
      const originStation = typeof route.originStation === 'string' 
        ? route.originStation 
        : route.originStation?.name || '';
      
      const destinationStation = typeof route.destinationStation === 'string'
        ? route.destinationStation
        : route.destinationStation?.name || '';

      return originStation.toLowerCase().includes(query) ||
             destinationStation.toLowerCase().includes(query) ||
             route.name.toLowerCase().includes(query);
    });

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredRoutes(sorted);
  }, [searchQuery, routes, sortOrder]);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''}`;
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-700">Đang tải danh sách tuyến đường...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 inline-block">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-800 mb-4"
          >
            Danh sách tuyến đường
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600"
          >
            {filteredRoutes.length} tuyến đường đang hoạt động
          </motion.p>
        </div>

        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo thành phố..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:border-blue-500 
                    focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              <button
                onClick={toggleSortOrder}
                className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-gray-200 
                  hover:bg-gray-50 transition-all duration-200"
              >
                <CalendarDays className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">
                  Sắp xếp: {sortOrder === 'asc' ? 'Cũ nhất trước' : 'Mới nhất trước'}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {filteredRoutes.map((route, index) => (
            <motion.div
              key={route._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <RouteIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{route.name}</h2>
                        <span className="px-4 py-1.5 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                          {route.code}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-4">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Khoảng cách</p>
                          <p className="text-lg font-semibold text-gray-800">{route.distanceKm} km</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Thời gian dự kiến</p>
                          <p className="text-lg font-semibold text-gray-800">{formatDuration(route.estimatedDuration)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4 md:min-w-[200px]">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      route.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {route.status === 'active' ? 'Đang hoạt động' : 'Tạm ngưng'}
                    </span>
                    <button 
                      className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                        transition-all duration-300 flex items-center justify-center gap-2 font-semibold
                        hover:transform hover:translate-y-[-2px] hover:shadow-lg"
                      onClick={() => navigate(`/routes/${route._id}`)}
                    >
                      Xem chi tiết
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredRoutes.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 text-lg">
                Không tìm thấy tuyến đường nào phù hợp với tìm kiếm của bạn.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutesPage;