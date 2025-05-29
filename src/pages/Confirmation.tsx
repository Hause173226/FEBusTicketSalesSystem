import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, CalendarIcon, MapPinIcon, UserIcon, ClockIcon, PrinterIcon, DownloadIcon } from 'lucide-react';
const Confirmation = () => {
  return <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-green-600 p-6 text-white text-center">
          <CheckCircleIcon size={64} className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Đặt vé thành công!</h2>
          <p>
            Mã đặt vé của bạn là: <span className="font-bold">VB24071538</span>
          </p>
        </div>
        <div className="p-6">
          <div className="border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold mb-4">Thông tin chuyến xe</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPinIcon size={20} className="mr-3 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Tuyến đường</p>
                  <p className="text-gray-600">Hà Nội → Hồ Chí Minh</p>
                </div>
              </div>
              <div className="flex items-start">
                <CalendarIcon size={20} className="mr-3 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Ngày khởi hành</p>
                  <p className="text-gray-600">Thứ 6, 15/07/2023</p>
                </div>
              </div>
              <div className="flex items-start">
                <ClockIcon size={20} className="mr-3 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Giờ khởi hành</p>
                  <p className="text-gray-600">19:00</p>
                </div>
              </div>
              <div className="flex items-start">
                <UserIcon size={20} className="mr-3 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Số ghế</p>
                  <p className="text-gray-600">A12, A13</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold mb-4">Thông tin hành khách</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <UserIcon size={20} className="mr-3 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Họ và tên</p>
                  <p className="text-gray-600">Nguyễn Văn A</p>
                </div>
              </div>
              <div className="flex items-start">
                <CalendarIcon size={20} className="mr-3 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">nguyenvana@example.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <ClockIcon size={20} className="mr-3 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Số điện thoại</p>
                  <p className="text-gray-600">0912 345 678</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Tổng thanh toán</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between font-bold text-lg">
                <span>Tổng cộng</span>
                <span>2,380,000₫</span>
              </div>
              <p className="text-green-600 text-sm mt-1">Đã thanh toán</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2">
              <PrinterIcon size={18} />
              In vé
            </button>
            <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2">
              <DownloadIcon size={18} />
              Tải vé PDF
            </button>
          </div>
          <div className="mt-6 text-center">
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>;
};
export default Confirmation;