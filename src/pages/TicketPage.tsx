import React, { useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import { ArrowLeft, Download, Printer, Bus, Calendar,  MapPin, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Booking } from '../types';
import { formatDate, formatPrice } from '../utils/dateUtils';

const TicketPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { profile, currentBooking } = useAppContext();
  const navigate = useNavigate();
  const ticketRef = useRef<HTMLDivElement>(null);
  
  // Find booking either from current booking or user bookings
  const booking = currentBooking?._id === bookingId
    ? currentBooking
    : profile?.bookings.find((b: Booking) => b._id === bookingId);
  
  // Use route information from booking data
  const route = booking?.trip?.route;
  
  if (!booking || !route) {
    return (
      <div className="container mx-auto px-4 py-16 mt-16 text-center">
        <p className="text-gray-600">Không tìm thấy thông tin vé</p>
        <Link 
          to="/"
          className="mt-4 inline-block px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors duration-200"
        >
          Về trang chủ
        </Link>
      </div>
    );
  }
  
  const generatePDF = () => {
    if (!ticketRef.current) return;
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Add company logo/name at the top
    pdf.setFontSize(24);
    pdf.setTextColor(26, 86, 219); // Blue color
    pdf.text('BusGo', 105, 20, { align: 'center' });
    
    // Add ticket title
    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0);
    pdf.text('VÉ XE KHÁCH', 105, 30, { align: 'center' });
    
    // Add route information
    pdf.setFontSize(14);
    pdf.text(`${booking.pickupStation?.name || (route as any)?.from} - ${booking.dropoffStation?.name || (route as any)?.to}`, 105, 40, { align: 'center' });
    
    // Add line separator
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, 45, 190, 45);
    
    // Add ticket details
    pdf.setFontSize(12);
    pdf.text(`Mã vé: ${booking.bookingCode || booking._id}`, 20, 55);
    pdf.text(`Ngày đi: ${booking.trip?.departureDate ? formatDate(booking.trip.departureDate) : 'Chưa xác định'}`, 20, 65);
    pdf.text(`Giờ khởi hành: ${booking.trip?.departureTime || (route as any)?.departureTime}`, 20, 75);
    pdf.text(`Nhà xe: ${booking.trip?.bus?.operator || (route as any)?.company}`, 20, 85);
    pdf.text(`Loại xe: ${booking.trip?.bus?.busType || (route as any)?.busType}`, 20, 95);
    
    // Add passenger info
    pdf.text(`Thông tin hành khách:`, 20, 110);
    pdf.text(`Họ tên: ${profile?.fullName || 'N/A'}`, 30, 120);
    pdf.text(`Số điện thoại: ${profile?.phone || 'N/A'}`, 30, 130);
    pdf.text(`Email: ${profile?.email || 'N/A'}`, 30, 140);
    
    // Add seat info
    pdf.text(`Số ghế: ${booking.seatNumbers?.join(', ') || 'N/A'}`, 20, 155);
    pdf.text(`Tổng tiền: ${formatPrice(booking.totalAmount || 0)}`, 20, 165);
    pdf.text(`Phương thức thanh toán: ${booking.paymentMethod || 'N/A'}`, 20, 175);
    
    // Add QR code (placeholder - in a real app, you'd need to generate this properly)
    pdf.addImage(
      document.getElementById('qr-code-svg')?.outerHTML || '', 
      'SVG', 
      130, 
      110, 
      60, 
      60
    );
    
    // Add footer with terms
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Vui lòng đến trước giờ khởi hành 30 phút. Vé đã thanh toán không hoàn tiền.', 105, 250, { align: 'center' });
    pdf.text('BusGo © 2023 - Đặt vé nhanh - Giá tốt - Tiện lợi', 105, 260, { align: 'center' });
    
    pdf.save(`ve-xe-${booking.bookingCode || booking._id}.pdf`);
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="pt-16 pb-12">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-700 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Quay lại
          </button>
          
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Chi tiết vé</h1>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-6 bg-blue-700 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bus className="h-8 w-8 mr-2" />
                <h2 className="text-xl font-semibold">Vé xe khách</h2>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={generatePDF}
                  title="Tải xuống PDF"
                  className="flex items-center p-2 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-colors duration-200"
                >
                  <Download className="h-5 w-5" />
                </button>
                <button
                  onClick={handlePrint}
                  title="In vé"
                  className="flex items-center p-2 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-colors duration-200"
                >
                  <Printer className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6" ref={ticketRef}>
            <div className="flex flex-col md:flex-row">
              <div className="flex-1">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Chi tiết hành trình
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="relative mr-4">
                        <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                        <div className="absolute top-4 bottom-0 left-1.5 w-1 h-12 bg-gray-300"></div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{booking.pickupStation?.name || (route as any)?.from}</p>
                        <p className="text-sm text-gray-500">{booking.trip?.departureTime || (route as any)?.departureTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-4">
                        <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{booking.dropoffStation?.name || (route as any)?.to}</p>
                        <p className="text-sm text-gray-500">{booking.trip?.arrivalTime || (route as any)?.arrivalTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Thông tin chuyến xe
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Nhà xe</p>
                      <p className="font-medium text-gray-800">{booking.trip?.bus?.operator || (route as any)?.company}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Loại xe</p>
                      <p className="font-medium text-gray-800">{booking.trip?.bus?.busType || (route as any)?.busType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ngày đi</p>
                      <p className="font-medium text-gray-800">{booking.trip?.departureDate ? formatDate(booking.trip.departureDate) : 'Chưa xác định'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mã vé</p>
                      <p className="font-medium text-gray-800">{booking.bookingCode || booking._id}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    Thông tin hành khách
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Họ tên</p>
                      <p className="font-medium text-gray-800">{profile?.fullName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Số điện thoại</p>
                      <p className="font-medium text-gray-800">{profile?.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-800">{profile?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Số ghế</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {booking.seatNumbers?.map((seatNumber: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                            {seatNumber}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Chi tiết thanh toán</h3>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Giá vé ({booking.seatNumbers?.length || 0} ghế)</span>
                      <span>{formatPrice((route as any)?.price * (booking.seatNumbers?.length || 0) || booking.totalAmount || 0)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Phí dịch vụ</span>
                      <span>{formatPrice(0)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Tổng cộng</span>
                        <span className="text-lg font-semibold text-blue-700">{formatPrice(booking.totalAmount || 0)}</span>
                      </div>
                      <div className="mt-1">
                        <span className="text-sm text-gray-500">Phương thức thanh toán: {booking.paymentMethod || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:ml-8 mt-6 md:mt-0 flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div id="qr-code-svg">
                    <QRCodeSVG
                      value={`BUSGO-TICKET-${booking.bookingCode || booking._id}`}
                      size={180}
                      level="H"
                      fgColor="#1A56DB"
                      includeMargin
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Quét mã để lên xe</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Lưu ý:</span> Vui lòng đến trước giờ khởi hành 30 phút. Xuất trình mã QR cho nhân viên để được lên xe.
              {booking.bookingStatus !== 'cancelled' && booking.bookingStatus !== 'completed' && (
                <span className="block mt-1">
                  Để hủy vé, vui lòng truy cập trang quản lý vé trong phần "Tài khoản" của bạn.
                </span>
              )}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TicketPage;