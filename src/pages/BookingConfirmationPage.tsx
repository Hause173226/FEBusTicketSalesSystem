import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, User, Phone, Mail, Calendar, Bus, CreditCard, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cancelBooking } from '../services/bookingServices';
import { seatsServices } from '../services/seatsServices';
import { toast } from 'react-hot-toast';
import { formatDateSimple, formatPrice, formatTime } from '../utils/dateUtils';
import BookingSteps from '../components/BookingSteps';

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { selectedTrip, selectedSeats, profile } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const loadBookingInfo = async () => {
      try {
        setLoading(true);
        
        if (!bookingId) {
          throw new Error("Mã đặt vé không hợp lệ");
        }

        // Lấy từ localStorage hoặc context
        const tempBookingStr = localStorage.getItem('temp_booking_data');
        let tempBooking: any = null;
        
        if (tempBookingStr) {
          tempBooking = JSON.parse(tempBookingStr);
          
          // Nếu có đầy đủ dữ liệu trong localStorage, sử dụng nó
          if (tempBooking.tripData && tempBooking.seatData && tempBooking.customerData) {
            const booking = {
              _id: bookingId || tempBooking.bookingId,
              bookingCode: tempBooking.bookingCode || `BK${Date.now()}`,
              customer: tempBooking.customerData,
              trip: tempBooking.tripData,
              pickupStation: tempBooking.tripData.route.originStation,
              dropoffStation: tempBooking.tripData.route.destinationStation,
              seatNumbers: tempBooking.seatData.map((seat: any) => seat.number),
              totalAmount: tempBooking.seatData.reduce((total: number, seat: any) => total + (seat.price || tempBooking.tripData.basePrice), 0),
              bookingStatus: 'pending',
              paymentStatus: 'pending',
              createdAt: new Date().toISOString(),
              isRealBooking: false // Đánh dấu là booking tạm thời
            };

            setBookingData(booking);
            return;
          }
        }

        // Kiểm tra xem có đủ thông tin từ context không
        if (selectedTrip && selectedSeats && selectedSeats.length > 0 && profile) {
          // Tạo object booking từ thông tin hiện có
          const booking = {
            _id: bookingId || tempBooking?.bookingId,
            bookingCode: tempBooking?.bookingCode || `BK${Date.now()}`,
            customer: profile,
            trip: selectedTrip,
            pickupStation: selectedTrip.route.originStation,
            dropoffStation: selectedTrip.route.destinationStation,
            seatNumbers: selectedSeats.map(seat => seat.number),
            totalAmount: selectedSeats.reduce((total, seat) => total + (seat.price || selectedTrip.basePrice), 0),
            bookingStatus: 'pending',
            paymentStatus: 'pending',
            createdAt: new Date().toISOString(),
            isRealBooking: false // Đánh dấu là booking tạm thời
          };

          setBookingData(booking);
        } else {
          throw new Error("Không tìm thấy thông tin đặt vé. Vui lòng đặt vé lại.");
        }
      } catch (err: any) {
        const errorMessage = err.message || "Không thể tải thông tin đặt vé";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadBookingInfo();
  }, [bookingId]);

  const handleProceedToPayment = () => {
    if (bookingData) {
      navigate(`/payment/vnpay/${bookingData._id}`);
    }
  };

  const handleGoBack = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      setShowCancelModal(false);
      
      // Hiển thị loading toast
      const loadingToast = toast.loading('Đang hủy đặt vé...');
      
      // Thử hủy booking qua API nếu có booking ID
      if (bookingData && bookingData._id) {
        try {
          await cancelBooking(bookingData._id);
        } catch (error: any) {
          // Nếu lỗi 404 (booking không tồn tại), coi như thành công
          if (error.response?.status !== 404) {
            toast.error(`Lỗi khi hủy booking: ${error.response?.data?.message || error.message}`);
          }
        }
      }
      
      // Luôn giải phóng ghế nếu có thông tin ghế và trip
      if (bookingData && bookingData.seatNumbers && bookingData.trip?._id) {
        try {
          await seatsServices.releaseSeat({
            tripId: bookingData.trip._id,
            seatNumbers: bookingData.seatNumbers
          });
        } catch (error) {
          toast.error('Có lỗi khi giải phóng ghế');
        }
      }
      
      // Xóa dữ liệu tạm trong localStorage
      localStorage.removeItem('temp_booking_data');
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Hiển thị thông báo thành công cuối cùng
      toast.success('Đã hủy đặt vé thành công');
      
      // Quay về trang trước
      navigate(-1);
      
    } catch (error) {
      toast.error('Có lỗi xảy ra khi hủy đặt vé');
      
      // Vẫn quay về trang trước ngay cả khi có lỗi
      navigate(-1);
    }
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Đang tải thông tin đặt vé...</span>
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

  if (!bookingData) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4">
        <div className="text-gray-500 mb-4 text-center max-w-md">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            Không tìm thấy thông tin đặt vé
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
      <div className="container mx-auto px-4 max-w-4xl mt-16">
        <BookingSteps currentStep={4} />
        
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Quay lại
          </button>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt vé thành công!</h1>
            <p className="text-gray-600">Vui lòng kiểm tra thông tin và tiến hành thanh toán</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Booking Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Thông tin đặt vé</h2>
              <div className="flex items-center justify-center space-x-2 text-green-100">
                <CreditCard className="h-4 w-4" />
                <p>Mã đặt vé: {bookingData.bookingCode}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Thông tin khách hàng */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Thông tin khách hàng
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Họ và tên</p>
                        <p className="font-medium text-gray-900">{bookingData.customer.fullName || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{bookingData.customer.email || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="font-medium text-gray-900">{bookingData.customer.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thông tin chuyến đi */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Thông tin chuyến đi
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Bus className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Tuyến đường</p>
                        <p className="font-medium text-gray-900">{bookingData.trip?.route?.name || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Ngày khởi hành</p>
                        <p className="font-medium text-gray-900">
                          {bookingData.trip?.departureDate ? 
                            formatDateSimple(bookingData.trip.departureDate) : 
                            'N/A'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Giờ khởi hành</p>
                        <p className="font-medium text-gray-900">{formatTime(bookingData.trip?.departureTime || 'N/A')}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Giờ đến (dự kiến)</p>
                        <p className="font-medium text-gray-900">{formatTime(bookingData.trip?.arrivalTime || 'N/A')}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Điểm đi</p>
                        <p className="font-medium text-gray-900">{bookingData.pickupStation?.name || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Điểm đến</p>
                        <p className="font-medium text-gray-900">{bookingData.dropoffStation?.name || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Thông tin ghế */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Ghế đã chọn</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {bookingData.seatNumbers?.map((seatNumber: string) => (
                      <span key={seatNumber} className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
                        {seatNumber}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    Tổng số ghế: {bookingData.seatNumbers?.length || 0}
                  </p>
                </div>

                {/* Thông tin thanh toán */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                    Thông tin thanh toán
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Giá vé cơ bản:</span>
                      <span className="font-medium text-gray-900">{formatPrice(bookingData.trip?.basePrice || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Số lượng ghế:</span>
                      <span className="font-medium text-gray-900">{bookingData.seatNumbers?.length || 0}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-800">Tổng tiền:</span>
                        <span className="text-2xl font-bold text-green-600">
                          {formatPrice(bookingData.totalAmount)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Lưu ý</p>
                          <p className="text-sm text-yellow-700">
                            Vé sẽ được giữ trong 15 phút. Vui lòng hoàn thành thanh toán để xác nhận đặt vé.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trạng thái đặt vé */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Trạng thái</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Trạng thái đặt vé:</span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                        Chờ thanh toán
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Thời gian đặt:</span>
                      <span className="font-medium text-gray-900">
                        {bookingData.createdAt ? 
                          new Date(bookingData.createdAt).toLocaleString('vi-VN') : 
                          'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <button
                onClick={handleGoBack}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Quay lại
              </button>
              <button
                onClick={handleProceedToPayment}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center font-medium"
              >
                Tiếp tục thanh toán
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833-.228 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Xác nhận hủy đặt vé
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Bạn có chắc chắn muốn hủy đặt vé này không? 
                Hành động này không thể hoàn tác và ghế đã chọn sẽ được giải phóng.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelModalClose}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
                >
                  Giữ đặt vé
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                >
                  Hủy đặt vé
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default BookingConfirmationPage;
