import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Route } from '../types';
import { useAppContext } from '../context/AppContext';

const TEMP_BOOKING_KEY = 'temp_booking_data';

interface RouteCardProps {
  route: Route;
}

const RouteCard: React.FC<RouteCardProps> = ({ route }) => {
  const navigate = useNavigate();
  const { setSelectedRoute } = useAppContext();

  const handleSelectRoute = () => {
    // Save initial booking data to localStorage
    const tempBookingData = {
      tripId: route._id,
      timestamp: new Date().toISOString(),
      seats: [] // Will be selected in the booking page
    };
    localStorage.setItem(TEMP_BOOKING_KEY, JSON.stringify(tempBookingData));
    
    // Set the selected route in context and navigate
    setSelectedRoute(route);
    navigate(`/booking/${route._id}`);
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{route.name || 'Route Name'}</h3>
            <p className="text-sm text-gray-500">{route.code || 'Route Code'}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-blue-700">{route.distanceKm}km</p>
            <p className="text-sm text-gray-500">/{route.estimatedDuration}h</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-gray-800 font-medium">
                  {typeof route.originStation === 'string' 
                    ? route.originStation 
                    : route.originStation?.name || 'Điểm xuất phát'}
                </p>
                <p className="text-sm text-gray-500">Khởi hành</p>
              </div>
            </div>
          </div>

          <div className="mx-4 border-t-2 border-gray-300 w-10"></div>

          <div className="flex-1">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-gray-800 font-medium">
                  {typeof route.destinationStation === 'string' 
                    ? route.destinationStation 
                    : route.destinationStation?.name || 'Điểm đến'}
                </p>
                <p className="text-sm text-gray-500">Đến nơi</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>
              {route.estimatedDuration}h
            </span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>
              {route.distanceKm}km - {route.status}
            </span>
          </div>
        </div>

        <button
          onClick={handleSelectRoute}
          className="w-full py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors duration-200"
        >
          Chọn chuyến
        </button>
      </div>
    </motion.div>
  );
};

export default RouteCard;