import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { routes, busLayout } from '../data';
import { useAppContext } from '../context/AppContext';
import SeatSelection from '../components/SeatSelection';
import BookingSummary from '../components/BookingSummary';

const BookingPage: React.FC = () => {
  const { routeId } = useParams<{ routeId: string }>();
  const { selectedRoute, selectedSeats, setSelectedRoute } = useAppContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If no selected route, find it by ID
    if (!selectedRoute && routeId) {
      const route = routes.find(r => r.id === routeId);
      if (route) {
        setSelectedRoute(route);
      } else {
        navigate('/routes');
      }
    }
  }, [routeId, selectedRoute, setSelectedRoute, navigate]);
  
  if (!selectedRoute) {
    return (
      <div className="container mx-auto px-4 py-16 mt-16 text-center">
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }
  
  // Apply route price to bus layout
  const routeBusLayout = {
    ...busLayout,
    seats: busLayout.seats.map(seat => ({
      ...seat,
      price: selectedRoute.price,
    })),
  };
  
  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert('Vui lòng chọn ít nhất một ghế');
      return;
    }
    
    navigate('/payment');
  };
  
  return (
    <div className="pt-16 pb-12">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-700 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Quay lại
          </button>
          
          <h1 className="text-2xl font-bold text-gray-800 mt-4">
            Chọn ghế: {selectedRoute.from} - {selectedRoute.to}
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <SeatSelection busLayout={routeBusLayout} />
            </motion.div>
          </div>
          
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <BookingSummary route={selectedRoute} selectedSeats={selectedSeats} />
              
              <div className="mt-6">
                <button
                  onClick={handleContinue}
                  disabled={selectedSeats.length === 0}
                  className={`w-full py-3 rounded-md transition-colors duration-200 flex items-center justify-center ${
                    selectedSeats.length > 0
                      ? 'bg-blue-700 hover:bg-blue-800 text-white'
                      : 'bg-gray-300 cursor-not-allowed text-gray-500'
                  }`}
                >
                  Tiếp tục
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;