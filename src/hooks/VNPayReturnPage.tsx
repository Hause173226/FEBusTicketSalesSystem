import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import paymentsServices from '../services/paymentsServices'; 
import LoadingSpinner from '../components/LoadingSpinner'; 

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
          // Xác định thông báo lỗi dựa trên mã response
          let errorMessage = 'Thanh toán thất bại. Vui lòng thử lại.';
          
          switch (vnp_ResponseCode) {
            case '24':
              errorMessage = 'Giao dịch bị hủy bởi người dùng';
              break;
            case '51':
              errorMessage = 'Số dư tài khoản không đủ để thực hiện giao dịch';
              break;
            case '06': 
              errorMessage = 'Có lỗi xảy ra trong quá trình xử lý. Thông tin thẻ không hợp lệ';
              break;
            case '15':
              errorMessage = 'Ngày hết hạn thẻ không chính xác';
              break;
            case '13':
              errorMessage = 'Mật khẩu xác thực giao dịch không chính xác';
              break;
            case '75':
              errorMessage = 'Ngân hàng thanh toán đang bảo trì';
              break;
            default:
              errorMessage = response.message || 'Thanh toán thất bại. Vui lòng thử lại.';
          }
          
          toast.error(errorMessage);
          navigate(`/payment/failed?code=${vnp_ResponseCode}&orderId=${storedBookingId}&message=${encodeURIComponent(errorMessage)}`, { 
            replace: true,
            state: { 
              orderId: storedBookingId,
              errorCode: vnp_ResponseCode,
              errorMessage: errorMessage
            } 
          });
        }
      } catch (error: any) {
        console.error('Payment verification error:', error);
        const errorMessage = error.message || 'Có lỗi xảy ra khi xác thực thanh toán';
        toast.error(errorMessage);
        navigate(`/payment/failed?message=${encodeURIComponent(errorMessage)}`, {
          replace: true,
          state: {
            errorMessage: errorMessage,
            orderId: storedBookingId
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
    <LoadingSpinner 
      title="Đang xử lý kết quả thanh toán..."
      description="Hệ thống đang xác thực giao dịch của bạn"
      size="large"
    />
  );
};

export default VNPayReturnPage; 