import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {  Clock, ArrowRight, Route as RouteIcon } from 'lucide-react';
import { Route } from '../types';
import { getAllRoutes } from '../services/routeServices';

const RoutesPage: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const data = await getAllRoutes();
        setRoutes(data);
      } catch (err) {
        console.error('Failed to fetch routes:', err);
        setError('Không thể tải danh sách tuyến đường. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''}`;
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Đang tải danh sách tuyến đường...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Danh sách tuyến đường</h1>
          <p className="mt-2 text-gray-600">{routes.length} tuyến đường đang hoạt động</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {routes.map((route) => (
            <motion.div
              key={route._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <RouteIcon className="h-6 w-6 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-800">{route.name}</h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
                      {route.code}
                    </span>
                  </div>

                  <div className="space-y-3">
                  

                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-gray-600">
                          <span className="font-medium">Thời gian dự kiến:</span>{' '}
                          {formatDuration(route.estimatedDuration)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <ArrowRight className="h-5 w-5 text-gray-500" />
                      <p className="text-gray-600">
                        <span className="font-medium">Khoảng cách:</span>{' '}
                        {route.distanceKm} km
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    route.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {route.status === 'active' ? 'Đang hoạt động' : 'Tạm ngưng'}
                  </span>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                    onClick={() => {/* TODO: Implement view route details */}}
                  >
                    Xem chi tiết
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoutesPage;