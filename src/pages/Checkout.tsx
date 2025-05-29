import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCardIcon, UserIcon, PhoneIcon, MailIcon, ClockIcon, InfoIcon } from 'lucide-react';
const Checkout = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    paymentMethod: 'card'
  });
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    // In a real app, process payment here
    navigate('/confirmation');
  };
  return <div className="container mx-auto px-4 py-8">
      {/* Booking Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
              1
            </div>
            <span className="text-sm mt-1">Chọn chuyến</span>
          </div>
          <div className="w-16 h-1 bg-blue-600 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
              2
            </div>
            <span className="text-sm mt-1">Chọn ghế</span>
          </div>
          <div className="w-16 h-1 bg-blue-600 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
              3
            </div>
            <span className="text-sm mt-1">Thanh toán</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Thông tin liên hệ</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className="block w-full rounded-md border-gray-300 py-2 px-4 border focus:border-blue-500 focus:ring-blue-500 pl-10" required />
                    <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="block w-full rounded-md border-gray-300 py-2 px-4 border focus:border-blue-500 focus:ring-blue-500 pl-10" required />
                    <MailIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="block w-full rounded-md border-gray-300 py-2 px-4 border focus:border-blue-500 focus:ring-blue-500 pl-10" required />
                    <PhoneIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-bold mb-6">Phương thức thanh toán</h2>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <input id="card" name="paymentMethod" type="radio" value="card" checked={formData.paymentMethod === 'card'} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                  <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-700">
                    Thẻ tín dụng / Thẻ ghi nợ
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="banking" name="paymentMethod" type="radio" value="banking" checked={formData.paymentMethod === 'banking'} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                  <label htmlFor="banking" className="ml-3 block text-sm font-medium text-gray-700">
                    Internet Banking
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="momo" name="paymentMethod" type="radio" value="momo" checked={formData.paymentMethod === 'momo'} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                  <label htmlFor="momo" className="ml-3 block text-sm font-medium text-gray-700">
                    Ví MoMo
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="vnpay" name="paymentMethod" type="radio" value="vnpay" checked={formData.paymentMethod === 'vnpay'} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                  <label htmlFor="vnpay" className="ml-3 block text-sm font-medium text-gray-700">
                    VNPay
                  </label>
                </div>
              </div>
              {formData.paymentMethod === 'card' && <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Số thẻ
                    </label>
                    <div className="relative">
                      <input type="text" id="cardNumber" placeholder="XXXX XXXX XXXX XXXX" className="block w-full rounded-md border-gray-300 py-2 px-4 border focus:border-blue-500 focus:ring-blue-500 pl-10" />
                      <CreditCardIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày hết hạn
                      </label>
                      <input type="text" id="expiry" placeholder="MM/YY" className="block w-full rounded-md border-gray-300 py-2 px-4 border focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input type="text" id="cvv" placeholder="XXX" className="block w-full rounded-md border-gray-300 py-2 px-4 border focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>}
              <div className="flex items-center mb-6">
                <input id="terms" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded" required />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  Tôi đồng ý với{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    điều khoản và điều kiện
                  </a>
                </label>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors">
                Hoàn tất thanh toán
              </button>
            </form>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-4">Thông tin đặt vé</h2>
            <div className="border-b pb-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Hà Nội → Hồ Chí Minh</h3>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-start">
                  <ClockIcon size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>Thứ 6, 15/07/2023 • 19:00</span>
                </div>
                <div className="flex items-start">
                  <InfoIcon size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>Phương Trang • Giường nằm cao cấp</span>
                </div>
              </div>
            </div>
            <div className="border-b pb-4 mb-4">
              <h3 className="font-semibold mb-2">Chi tiết giá</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Giá vé (2 hành khách)</span>
                  <span>2,400,000₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phí dịch vụ</span>
                  <span>30,000₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mã giảm giá</span>
                  <span className="text-green-600">-50,000₫</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Tổng cộng</span>
              <span>2,380,000₫</span>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Checkout;