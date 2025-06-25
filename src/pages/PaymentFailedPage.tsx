import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircleIcon } from 'lucide-react';

const PaymentFailedPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get('message') || 'Có lỗi xảy ra trong quá trình thanh toán';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Thanh toán thất bại</h1>
        <p className="text-gray-600 mb-8">{errorMessage}</p>
        <div className="space-y-4">
          <button
            onClick={() => window.history.back()}
            className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Thử lại
          </button>
          <button
            onClick={() => navigate('/bookings')}
            className="w-full bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Xem đơn hàng của tôi
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage; 