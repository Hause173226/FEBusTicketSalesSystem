import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Clock, User, Phone, Mail, CreditCard, Building, Calendar } from "lucide-react";
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
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Đang tải thông tin đơn hàng...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4">
        <div className="text-red-500 mb-4 text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            {error}
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  if (!bookingDetail) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4">
        <div className="text-gray-500 mb-4 text-center max-w-md">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            Không tìm thấy thông tin đơn hàng
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 max-w-5xl mt-16">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Chi tiết đơn đặt vé</h1>
                <div className="flex items-center space-x-2 text-blue-100">
                  <CreditCard className="h-4 w-4" />
                  <p>Mã đặt vé: {bookingDetail.bookingCode}</p>
                </div>
              </div>
              {bookingDetail.paymentHistory?.paymentStatus === 'success' && (
                <div className="bg-green-500 px-4 py-2 rounded-full text-sm font-medium">
                  Đã thanh toán
                </div>
              )}
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Thông tin khách hàng */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Thông tin khách hàng
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Họ và tên</p>
                        <p className="font-medium text-gray-900">{bookingDetail.customer.fullName || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{bookingDetail.customer.email || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="font-medium text-gray-900">{bookingDetail.customer.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thông tin chuyến đi */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Thông tin chuyến đi
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Building className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Tuyến đường</p>
                        <p className="font-medium text-gray-900">{bookingDetail.trip?.route?.name || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Ngày khởi hành</p>
                        <p className="font-medium text-gray-900">
                          {bookingDetail.trip?.departureDate ? 
                            (() => {
                              try {
                                const date = new Date(bookingDetail.trip.departureDate);
                                return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('vi-VN');
                              } catch {
                                return 'N/A';
                              }
                            })() : 
                            'N/A'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Giờ khởi hành</p>
                        <p className="font-medium text-gray-900">{bookingDetail.trip?.departureTime || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Giờ đến (dự kiến)</p>
                        <p className="font-medium text-gray-900">{bookingDetail.trip?.arrivalTime || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Số ghế</p>
                        <p className="font-medium text-gray-900">{bookingDetail.seatNumbers?.join(', ') || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Payment Information */}
              <div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                    Thông tin thanh toán
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Tổng tiền</p>
                        <p className="text-xl font-semibold text-blue-600">
                          {bookingDetail.totalAmount?.toLocaleString('vi-VN')} VNĐ
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Trạng thái thanh toán</p>
                        <div className="mt-1">
                          {bookingDetail.paymentHistory?.paymentStatus === 'success' ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                              Đã thanh toán
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                              <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                              Chưa thanh toán
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Mã giao dịch</p>
                        <p className="font-medium text-gray-900">{bookingDetail.paymentHistory?.transactionId || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Thời gian xử lý</p>
                        <p className="font-medium text-gray-900">
                          {bookingDetail.paymentHistory?.processedAt ? 
                            new Date(bookingDetail.paymentHistory.processedAt).toLocaleString('vi-VN') : 
                            'N/A'
                          }
                        </p>
                      </div>
                    </div>

                    {/* Chi tiết từ VNPay */}
                    {bookingDetail.paymentHistory?.gatewayResponse && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Chi tiết từ VNPay</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Mã ngân hàng</p>
                              <p className="font-medium text-gray-900">
                                {bookingDetail.paymentHistory.gatewayResponse.vnp_BankCode}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Loại thẻ</p>
                              <p className="font-medium text-gray-900">
                                {bookingDetail.paymentHistory.gatewayResponse.vnp_CardType}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Mã GD ngân hàng</p>
                              <p className="font-medium text-gray-900">
                                {bookingDetail.paymentHistory.gatewayResponse.vnp_BankTranNo}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Thời gian TT</p>
                              <p className="font-medium text-gray-900">
                                {bookingDetail.paymentHistory.gatewayResponse.vnp_PayDate}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Thông tin đơn hàng</p>
                            <p className="font-medium text-gray-900 break-words">
                              {bookingDetail.paymentHistory.gatewayResponse.vnp_OrderInfo}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 mt-8 flex justify-between items-center border-t border-gray-100">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Về trang chủ
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
            >
              <span>In vé</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingDetailPage;
