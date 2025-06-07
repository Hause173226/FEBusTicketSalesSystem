import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <Bus className="h-8 w-8 text-blue-400" />
              <span className="ml-2 font-bold text-xl">BusGo</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Đặt vé nhanh - Giá tốt - Tiện lợi
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Tuyến xe phổ biến</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/routes" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Hà Nội - Hồ Chí Minh
                </Link>
              </li>
              <li>
                <Link to="/routes" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Hà Nội - Đà Nẵng
                </Link>
              </li>
              <li>
                <Link to="/routes" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Hồ Chí Minh - Đà Lạt
                </Link>
              </li>
              <li>
                <Link to="/routes" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Hồ Chí Minh - Vũng Tàu
                </Link>
              </li>
              <li>
                <Link to="/routes" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Hồ Chí Minh - Cần Thơ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/routes" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Tuyến xe
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Đăng ký
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                <span className="text-gray-400">123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-blue-400 mr-2" />
                <span className="text-gray-400">1900 1234</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-blue-400 mr-2" />
                <span className="text-gray-400">support@busgo.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} BusGo. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;