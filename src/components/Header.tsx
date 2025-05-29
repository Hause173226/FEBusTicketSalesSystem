import React from 'react';
import { Link } from 'react-router-dom';
import { BusIcon, MenuIcon, UserIcon, PhoneIcon } from 'lucide-react';
const Header = () => {
  return <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <BusIcon size={24} />
          <span>VIET BUS</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-blue-200 transition-colors">
            Trang chủ
          </Link>
          <Link to="/" className="hover:text-blue-200 transition-colors">
            Lịch trình
          </Link>
          <Link to="/" className="hover:text-blue-200 transition-colors">
            Khuyến mãi
          </Link>
          <Link to="/" className="hover:text-blue-200 transition-colors">
            Liên hệ
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <a href="tel:1900123456" className="hidden md:flex items-center gap-1 hover:text-blue-200">
            <PhoneIcon size={18} />
            <span>1900 123 456</span>
          </a>
          <Link to="/" className="p-2 hover:bg-blue-700 rounded-full">
            <UserIcon size={20} />
          </Link>
          <button className="md:hidden p-2 hover:bg-blue-700 rounded-full">
            <MenuIcon size={20} />
          </button>
        </div>
      </div>
    </header>;
};
export default Header;