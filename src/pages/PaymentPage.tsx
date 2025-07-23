import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import BookingSummary from '../components/BookingSummary';
import UserForm from '../components/UserForm';
import PaymentMethods from '../components/PaymentMethods';
import BookingSteps from '../components/BookingSteps';

const PaymentPage: React.FC = () => {
  const { selectedRoute, selectedSeats, isLoggedIn } = useAppContext();
  const [step, setStep] = useState<'user-info' | 'payment'>(isLoggedIn ? 'payment' : 'user-info');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if no route or seats selected
    if (!selectedRoute || selectedSeats.length === 0) {
      navigate('/routes');
    }
  }, [selectedRoute, selectedSeats, navigate]);
  
  if (!selectedRoute || selectedSeats.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 mt-16 text-center">
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }
  
  const handleUserFormComplete = () => {
    setStep('payment');
  };
  
  const handlePaymentComplete = (bookingId: string) => {
    // Navigate to ticket page (handled in PaymentMethods component)
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
          
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Thanh toán</h1>
        </div>
        
        <BookingSteps currentStep={4} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              {step === 'user-info' ? (
                <UserForm onComplete={handleUserFormComplete} />
              ) : (
                <PaymentMethods onPaymentComplete={handlePaymentComplete} />
              )}
            </motion.div>
          </div>
          
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <BookingSummary route={selectedRoute} selectedSeats={selectedSeats} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;