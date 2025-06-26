import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import paymentsServices from "../services/paymentsServices";
import { BookingOrderDetails } from "../types";
import { toast } from "react-hot-toast";

const BookingDetailPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingDetail, setBookingDetail] = useState<BookingOrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        // Lấy orderId từ URL params hoặc query params
        const searchParams = new URLSearchParams(location.search);
        const orderIdFromQuery = searchParams.get('orderId');
        const finalOrderId = orderIdFromQuery || orderId;

        if (!finalOrderId) {
          throw new Error("Mã đơn hàng không được để trống");
        }

        setLoading(true);
        const response = await paymentsServices.getBookingDetails(finalOrderId);
        setBookingDetail(response);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || "Không thể tải thông tin đơn hàng";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetail();
  }, [orderId, location.search]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  if (!bookingDetail) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="text-gray-500 mb-4">Không tìm thấy thông tin đơn hàng</div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-4">
            <h1 className="text-2xl font-bold">Chi tiết đơn đặt vé</h1>
            <p className="text-blue-100">Mã đặt vé: {bookingDetail.bookingCode}</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Thông tin khách hàng */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                Thông tin khách hàng
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Họ và tên</p>
                  <p className="font-medium">{bookingDetail.customer?.fullName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{bookingDetail.customer?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Số điện thoại</p>
                  <p className="font-medium">{bookingDetail.customer?.phoneNumber || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Thông tin chuyến đi */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                Thông tin chuyến đi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Tuyến đường</p>
                  <p className="font-medium">{bookingDetail.trip?.route?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Ngày khởi hành</p>
                  <p className="font-medium">
                    {bookingDetail.trip?.departureDate ? 
                      new Date(bookingDetail.trip.departureDate).toLocaleDateString('vi-VN') : 
                      'N/A'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Giờ khởi hành</p>
                  <p className="font-medium">{bookingDetail.trip?.departureTime || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Giờ đến (dự kiến)</p>
                  <p className="font-medium">{bookingDetail.trip?.arrivalTime || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Số ghế</p>
                  <p className="font-medium">{bookingDetail.seatNumbers?.join(', ') || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Thông tin thanh toán */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                Thông tin thanh toán
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">Tổng tiền</p>
                  <p className="text-xl font-bold text-blue-600">
                    {bookingDetail.totalAmount?.toLocaleString('vi-VN')} VNĐ
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Phương thức thanh toán</p>
                  <p className="font-medium">{bookingDetail.paymentHistory?.paymentMethod || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Trạng thái thanh toán</p>
                  <div className="mt-1">
                    {bookingDetail.paymentHistory?.paymentStatus === 'success' ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                        Đã thanh toán
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                        Chưa thanh toán
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Mã giao dịch</p>
                  <p className="font-medium">{bookingDetail.paymentHistory?.transactionId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Số tiền thanh toán</p>
                  <p className="font-medium">
                    {bookingDetail.paymentHistory?.amount?.toLocaleString('vi-VN')} VNĐ
                  </p>
                </div>
                {bookingDetail.paymentHistory?.processedAt && (
                  <div>
                    <p className="text-gray-600">Thời gian xử lý</p>
                    <p className="font-medium">
                      {new Date(bookingDetail.paymentHistory.processedAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                )}
                {bookingDetail.paymentHistory?.notes && (
                  <div>
                    <p className="text-gray-600">Ghi chú</p>
                    <p className="font-medium">{bookingDetail.paymentHistory.notes}</p>
                  </div>
                )}
                
                {/* Chi tiết từ cổng thanh toán VNPay */}
                {bookingDetail.paymentHistory?.gatewayResponse && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Chi tiết từ VNPay</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-gray-600 text-sm">Mã ngân hàng</p>
                        <p className="font-medium">{bookingDetail.paymentHistory.gatewayResponse.vnp_BankCode}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Loại thẻ</p>
                        <p className="font-medium">{bookingDetail.paymentHistory.gatewayResponse.vnp_CardType}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Mã giao dịch ngân hàng</p>
                        <p className="font-medium">{bookingDetail.paymentHistory.gatewayResponse.vnp_BankTranNo}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Thời gian thanh toán</p>
                        <p className="font-medium">
                          {bookingDetail.paymentHistory.gatewayResponse.vnp_PayDate}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-600 text-sm">Thông tin đơn hàng</p>
                        <p className="font-medium">{bookingDetail.paymentHistory.gatewayResponse.vnp_OrderInfo}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Về trang chủ
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              In vé
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
