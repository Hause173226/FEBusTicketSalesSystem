import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("orderId");

  const handleViewDetails = () => {
    if (orderId) {
      navigate(`/booking-details/${orderId}`);
    }
  };

  const handleBackHome = () => {
    navigate("/");
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'VNPay':
        return 'VNPay';
      default:
        return method;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <FaCheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Thanh toán thành công!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thanh toán của bạn đã được xử lý thành công qua {getPaymentMethodText(location.state?.paymentMethod || '')}
          </p>
          {orderId && (
            <p className="text-sm text-gray-500 mt-1">
              Mã đơn hàng: <span className="font-semibold">{orderId}</span>
            </p>
          )}
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={handleViewDetails}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Xem chi tiết đơn hàng
          </button>
          
          <button
            onClick={handleBackHome}
            className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage; 