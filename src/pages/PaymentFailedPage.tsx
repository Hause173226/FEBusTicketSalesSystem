import React from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { XCircleIcon, AlertTriangleIcon } from 'lucide-react';
import PaymentFailureHelper from '../components/PaymentFailureHelper';

const PaymentFailedPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Lấy thông tin lỗi từ query params hoặc state
  const errorMessage = searchParams.get('message') || 
                      location.state?.errorMessage || 
                      'Có lỗi xảy ra trong quá trình thanh toán';
  
  const errorCode = searchParams.get('code') || location.state?.errorCode;
  const orderId = searchParams.get('orderId') || location.state?.orderId;
  
  // Xác định loại lỗi và hiển thị thông báo phù hợp
  const getErrorDetails = () => {
    if (errorCode === '24') {
      return {
        title: 'Thanh toán bị hủy',
        message: 'Bạn đã hủy giao dịch thanh toán',
        icon: AlertTriangleIcon,
        color: 'text-orange-500'
      };
    } else if (errorCode === '51' || errorCode === '06') {
      return {
        title: 'Thông tin thẻ không hợp lệ', 
        message: 'Số dư tài khoản không đủ hoặc thông tin thẻ không chính xác',
        icon: XCircleIcon,
        color: 'text-red-500'
      };
    } else if (errorCode === '15') {
      return {
        title: 'Thông tin không chính xác',
        message: 'Thông tin ngày hết hạn thẻ không chính xác',
        icon: XCircleIcon,
        color: 'text-red-500'
      };
    } else {
      return {
        title: 'Thanh toán thất bại',
        message: errorMessage,
        icon: XCircleIcon,
        color: 'text-red-500'
      };
    }
  };
  
  const errorDetails = getErrorDetails();
  const IconComponent = errorDetails.icon;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <IconComponent className={`h-16 w-16 ${errorDetails.color} mx-auto mb-4`} />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{errorDetails.title}</h1>
        <p className="text-gray-600 mb-4">{errorDetails.message}</p>
        
        {/* Hiển thị mã lỗi nếu có */}
        {errorCode && (
          <div className="bg-gray-50 p-3 rounded-lg mb-6">
            <p className="text-sm text-gray-500">
              <span className="font-medium">Mã lỗi:</span> {errorCode}
            </p>
            {orderId && (
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-medium">Mã đơn hàng:</span> {orderId}
              </p>
            )}
          </div>
        )}
        
        {/* Hướng dẫn cho từng loại lỗi */}
        {errorCode === '24' && (
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-medium text-orange-800 mb-2">Bạn có thể:</h3>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Thử lại thanh toán với cùng phương thức</li>
              <li>• Chọn phương thức thanh toán khác</li>
              <li>• Liên hệ với chúng tôi nếu cần hỗ trợ</li>
            </ul>
          </div>
        )}
        
        {(errorCode === '51' || errorCode === '06') && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-medium text-red-800 mb-2">Vui lòng kiểm tra:</h3>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Số dư tài khoản</li>
              <li>• Thông tin thẻ nhập chính xác</li>
              <li>• Thẻ đã được kích hoạt thanh toán online</li>
            </ul>
          </div>
        )}
        
        <div className="space-y-4">
          <button
            onClick={() => navigate('/')}
            className="w-full border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
        
        {/* Component hỗ trợ */}
        <PaymentFailureHelper />
      </div>
    </div>
  );
};

export default PaymentFailedPage; 