import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircleIcon } from 'lucide-react';
import paymentsServices from '../services/paymentsServices';
import { VNPayPaymentStatus } from '../types';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<VNPayPaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const queryString = '?' + Array.from(searchParams.entries())
          .map(([key, value]) => `${key}=${value}`)
          .join('&');
        
        const response = await paymentsServices.handleVNPayReturn(queryString);
        setPaymentDetails(response);
      } catch (error) {
        console.error('Payment verification failed:', error);
        navigate('/payment-failed');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Thanh toán thành công!</h1>
        {paymentDetails && (
          <div className="space-y-3 text-left">
            <p className="text-gray-600">
              <span className="font-semibold">Mã đơn hàng:</span> {paymentDetails.orderId}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Số tiền:</span>{' '}
              {paymentDetails.amount?.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
              })}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Thời gian:</span>{' '}
              {paymentDetails.paymentTime && new Date(paymentDetails.paymentTime).toLocaleString('vi-VN')}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Mã giao dịch:</span> {paymentDetails.transactionId}
            </p>
          </div>
        )}
        <div className="mt-8 space-x-4">
          <button
            onClick={() => navigate('/bookings')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Xem đơn hàng
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage; 