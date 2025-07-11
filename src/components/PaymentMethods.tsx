import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { createBooking } from '../services/bookingServices';
import { seatsServices } from '../services/seatsServices';  
interface PaymentMethodsProps {
  onPaymentComplete: (bookingId: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ onPaymentComplete }) => {
  const navigate = useNavigate();
  const { profile, selectedTrip, selectedSeats } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVNPayPayment = async () => {
    if (!selectedTrip || selectedSeats.length === 0 || !profile) {
      setError('Thiếu thông tin đặt vé. Vui lòng thử lại.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const totalAmount = selectedSeats.reduce((total, seat) => total + seat.price, 0);
      const bookingData = {
        trip: selectedTrip._id,
        customer: profile._id,
        pickupStation: selectedTrip.route.originStation._id,
        dropoffStation: selectedTrip.route.destinationStation._id,
        seatNumbers: selectedSeats.map(seat => seat.number),
        totalAmount: totalAmount
      };

      const booking = await createBooking(bookingData);

      await seatsServices.confirmSeatBooking({
        tripId: selectedTrip._id,
        seatNumbers: selectedSeats.map(seat => seat.number),
        bookingId: booking._id
      });

      // Navigate to booking confirmation page instead of direct payment
      navigate(`/booking-confirmation/${booking._id}`);
      onPaymentComplete(booking._id);
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Không thể xử lý thanh toán. Vui lòng thử lại sau.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <button
        onClick={handleVNPayPayment}
        disabled={isProcessing}
        className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-3">
          <img src="/vnpay-logo.png" alt="VNPay" className="h-8 w-auto" />
          <div>
            <p className="font-medium text-gray-800">Thanh toán qua VNPay</p>
            <p className="text-sm text-gray-500">Thanh toán an toàn với VNPay</p>
          </div>
        </div>
        {isProcessing ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        ) : (
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default PaymentMethods; 