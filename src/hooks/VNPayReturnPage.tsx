import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import paymentsServices from '../services/paymentsServices'; 

const VNPayReturnPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handlePaymentReturn = async () => {
      const storedBookingId = localStorage.getItem('vnpay_booking_id');
      const storedOrderId = localStorage.getItem('vnpay_order_id');

      try {
        const params = new URLSearchParams(location.search);
        const vnp_ResponseCode = params.get('vnp_ResponseCode');
        const vnp_TxnRef = params.get('vnp_TxnRef');

        if (!vnp_TxnRef || !storedBookingId || !storedOrderId) {
          throw new Error('Không tìm thấy thông tin đơn hàng');
        }

        const response = await paymentsServices.vnpay.handleReturn(location.search);

        if (response.isSuccess && vnp_ResponseCode === '00') {
          toast.success('Thanh toán thành công!');
          navigate(`/payment-success?orderId=${storedBookingId}`, { 
            replace: true,
            state: { paymentMethod: 'VNPay' }
          });
        } else {
          toast.error(response.message || 'Thanh toán thất bại. Vui lòng thử lại.');
          navigate('/payment/failed', { 
            replace: true,
            state: { 
              orderId: storedBookingId,
              errorCode: vnp_ResponseCode,
              errorMessage: response.message || 'Thanh toán thất bại'
            } 
          });
        }
      } catch (error: any) {
        console.error('Payment verification error:', error);
        toast.error(error.message || 'Có lỗi xảy ra khi xác thực thanh toán');
        navigate('/payment/failed', {
          replace: true,
          state: {
            errorMessage: error.message || 'Có lỗi xảy ra khi xác thực thanh toán'
          }
        });
      } finally {
        localStorage.removeItem('vnpay_booking_id');
        localStorage.removeItem('vnpay_order_id');
      }
    };

    handlePaymentReturn();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang xử lý kết quả thanh toán...</p>
        <p className="mt-2 text-sm text-gray-500">Vui lòng không tắt trình duyệt</p>
      </div>
    </div>
  );
};

export default VNPayReturnPage; 