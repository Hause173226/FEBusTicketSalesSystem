import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, User, Phone, Mail, Calendar, Bus, CreditCard, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getBookingById } from '../services/bookingServices';
import { toast } from 'react-hot-toast';

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { selectedTrip, selectedSeats, profile } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    const loadBookingInfo = async () => {
      try {
        setLoading(true);
        
        console.log('BookingConfirmationPage - Loading booking info...', { 
          bookingId, 
          hasSelectedTrip: !!selectedTrip, 
          hasSelectedSeats: !!selectedSeats, 
          hasProfile: !!profile 
        });
        
        if (!bookingId) {
          throw new Error("Mã đặt vé không hợp lệ");
        }

        // Thử lấy từ API trước
        try {
          console.log('Trying to fetch booking from API...', bookingId);
          const booking = await getBookingById(bookingId);
          console.log('Successfully fetched booking from API:', booking);
          setBookingData(booking);
          return;
        } catch (apiError) {
          console.log('API call failed, trying localStorage/context...', apiError);
        }

        // Nếu API fail, thử lấy từ localStorage hoặc context
        const tempBookingStr = localStorage.getItem('temp_booking_data');
        let tempBooking: any = null;
        
        if (tempBookingStr) {
          tempBooking = JSON.parse(tempBookingStr);
          console.log('Found temp booking in localStorage:', tempBooking);
          
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
              createdAt: new Date().toISOString()
            };

            console.log('Created booking from localStorage:', booking);
            setBookingData(booking);
            return;
          }
        }

        // Kiểm tra xem có đủ thông tin từ context không
        if (selectedTrip && selectedSeats && selectedSeats.length > 0 && profile) {
          console.log('Creating booking from context data...');
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
            createdAt: new Date().toISOString()
          };

          console.log('Created booking object:', booking);
          setBookingData(booking);
        } else {
          console.log('Insufficient data:', { selectedTrip, selectedSeats, profile, tempBooking });
          throw new Error("Không tìm thấy thông tin đặt vé. Vui lòng đặt vé lại.");
        }
      } catch (err: any) {
        console.error('Error loading booking info:', err);
        const errorMessage = err.message || "Không thể tải thông tin đặt vé";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadBookingInfo();
  }, [bookingId, selectedTrip, selectedSeats, profile]);

  const handleProceedToPayment = () => {
    if (bookingData) {
      navigate(`/payment/vnpay/${bookingData._id}`);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatTime = (timeString: string) => {
    return timeString;
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
                            formatDate(bookingData.trip.departureDate) : 
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
    </motion.div>
  );
};

export default BookingConfirmationPage;
