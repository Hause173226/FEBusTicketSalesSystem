import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bus, Menu, X, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoggedIn, user, logout } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Tuyến xe', path: '/routes' },
    { name: 'Đặt vé', path: '/routes' },
    { name: 'Liên hệ', path: '/contact' },
  ];

  const menuVariants = {
    closed: { opacity: 0, x: '100%' },
    open: { opacity: 1, x: 0 },
  };

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
                  <span>{user?.fullName || 'Tài khoản'}</span>
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-800"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white pt-16 z-40 md:hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="py-3 border-b border-gray-200 text-gray-800 hover:text-blue-600 transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
              
              {isLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    className="py-3 border-b border-gray-200 text-gray-800 hover:text-blue-600 transition-colors duration-200"
                  >
                    {user?.fullName || 'Tài khoản'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="py-3 text-left text-gray-800 hover:text-blue-600 transition-colors duration-200"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <div className="flex flex-col mt-4">
                  <Link
                    to="/login"
                    className="py-3 px-4 mb-2 text-center text-blue-700 border border-blue-700 rounded-md hover:bg-blue-50 transition-colors duration-200"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="py-3 px-4 text-center text-white bg-blue-700 rounded-md hover:bg-blue-800 transition-colors duration-200"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;