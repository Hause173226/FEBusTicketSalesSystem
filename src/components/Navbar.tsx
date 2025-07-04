import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bus, User, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { signoutService } from '../services/signoutService';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoggedIn, profile, logout } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const result = await signoutService.handleSignout();
      logout();
      navigate('/');
      
      if (!result.success) {
        // You could show a toast message here if needed
        console.error(result);
      }
    } catch (error) {
      console.error('Error signing out:', error);
      // Still logout and navigate even if there's an error
      logout();
      navigate('/');
    }
  };

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Tuyến xe', path: '/routes' },
    { name: 'Liên hệ', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center">
            <Bus className="h-8 w-8 text-blue-700" />
            <span className="ml-2 font-bold text-lg md:text-xl text-blue-700">BusGo</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-blue-700'
                    : isScrolled
                    ? 'text-gray-800 hover:text-blue-600'
                    : 'text-gray-800 hover:text-blue-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Authentication Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200"
                >
                  <User className="h-5 w-5 mr-1" />
                  <span>{profile?.fullName || 'Tài khoản'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors duration-200"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 transition-colors duration-200"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;