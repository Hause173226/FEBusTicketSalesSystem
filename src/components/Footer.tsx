import React from 'react';
import { BusIcon, PhoneIcon, MailIcon, MapPinIcon, FacebookIcon, InstagramIcon } from 'lucide-react';
const Footer = () => {
  return <footer className="bg-gray-800 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-xl mb-4">
              <BusIcon size={24} />
              <span>VIET BUS</span>
            </div>
            <p className="text-gray-300 mb-4">
              Hệ thống đặt vé xe liên tỉnh hàng đầu Việt Nam với hơn 500 tuyến
              đường và 300 nhà xe uy tín.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-blue-400">
                <FacebookIcon size={20} />
              </a>
              <a href="#" className="text-white hover:text-pink-400">
                <InstagramIcon size={20} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <PhoneIcon size={16} />
                <span>1900 123 456</span>
              </li>
              <li className="flex items-center gap-2">
                <MailIcon size={16} />
                <span>hotro@vietbus.vn</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPinIcon size={16} className="mt-1 flex-shrink-0" />
                <span>123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Hướng dẫn đặt vé
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Phương thức thanh toán
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>© 2023 VIET BUS. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;