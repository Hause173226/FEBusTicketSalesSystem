import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import paymentsServices from '../services/paymentsServices';   
import { VNPayPaymentRequest } from '../types';

const VNPayPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams<{ bookingId: string }>();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    const processPayment = async () => {
      if (hasProcessed.current || !bookingId) {
        setError('Không tìm thấy mã đặt vé');
        setIsProcessing(false);
        return;
      }

      hasProcessed.current = true;
      
      try {
        const response = await paymentsServices.vnpay.create({ bookingId });

        if (!response.payUrl || !response.orderId) {
          throw new Error('Không nhận được thông tin thanh toán từ VNPay');
        }

        // Lưu thông tin đơn hàng
        localStorage.setItem('vnpay_booking_id', bookingId);
        localStorage.setItem('vnpay_order_id', response.orderId);

        // Chuyển hướng đến trang thanh toán VNPay
        window.location.href = response.payUrl;
      } catch (err: any) {
        console.error('Payment error:', err);
        setError(err.message || 'Không thể xử lý thanh toán. Vui lòng thử lại sau.');
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [bookingId, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Lỗi thanh toán</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
            <button
              onClick={() => navigate('/bookings')}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Quay lại đơn hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang chuyển hướng đến trang thanh toán VNPay...</p>
      </div>
    </div>
  );
};

export default VNPayPaymentPage; 