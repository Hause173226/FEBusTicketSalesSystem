import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { createBooking } from '../services/bookingServices';
import paymentsServices from '../services/paymentsServices';
import { VNPayPaymentRequest } from '../types';

interface PaymentMethodsProps {
  tripId: string;
  seatNumbers: string[];
  totalAmount: number;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ tripId, seatNumbers, totalAmount }) => {
  const { user } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVNPayPayment = async () => {
    if (!tripId || seatNumbers.length === 0 || !user) {
      setError('Thiếu thông tin đặt vé. Vui lòng thử lại.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create booking first
      const bookingData = {
        trip: tripId,
        customer: user._id,
        seatNumber: seatNumbers,
        totalPrice: totalAmount,
        bookingStatus: "pending",
        paymentStatus: "pending",
        paymentMethod: "vnpay"
      };

      const booking = await createBooking(bookingData);

      // Create VNPay payment
      const paymentData = {
        orderId: booking._id,
        amount: totalAmount,
        orderInfo: `Thanh toán vé xe - Mã đơn: ${booking._id}`,
        returnUrl: `${window.location.origin}/payment-success`,
        bookingId: booking._id
      };

      const paymentResponse = await paymentsServices.createVNPayPayment(paymentData as VNPayPaymentRequest);
      
      if (paymentResponse.data?.paymentUrl) {
        window.location.href = paymentResponse.data.paymentUrl;
      } else {
        throw new Error('Không nhận được URL thanh toán');
      }
    } catch (error) {
      console.error('Lỗi khi tạo thanh toán:', error);
      setError('Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại sau.');
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