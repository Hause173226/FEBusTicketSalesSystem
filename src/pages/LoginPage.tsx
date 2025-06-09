import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Lock, ArrowRight, AlertCircle } from 'lucide-react'; // Changed Mail to Phone
import { useAppContext } from '../context/AppContext';
import { userServices } from "../services/userServices";

const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState(''); // Changed from email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state or default to home
  const from = location.state?.from || '/';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !password) {
      setError('Vui lòng nhập số điện thoại và mật khẩu');
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^(0|84|\+84)([0-9]{9})$/;
    if (!phoneRegex.test(phone)) {
      setError('Số điện thoại không hợp lệ');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await userServices.login(phone, password);
      
      if (response.status === 200) {
        // Token is automatically saved by userServices.login
        await login(phone, password);
        navigate(from);
      } else {
        setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
      }
      
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="pt-16 pb-12">
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-144px)]">
        <motion.div
          className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="p-6 bg-blue-700 text-white">
            <h2 className="text-2xl font-bold">Đăng nhập</h2>
            <p className="mt-1">Đăng nhập để đặt vé và quản lý tài khoản</p>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                <div className="flex justify-end mt-1">
                  <Link to="/forgot-password" className="text-sm text-blue-700 hover:underline">
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>
              
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-3 rounded-md transition-colors duration-200 flex items-center justify-center ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-700 hover:bg-blue-800 text-white'
                }`}
              >
                {loading ? 'Đang xử lý...' : (
                  <>
                    Đăng nhập
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-blue-700 hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
            
            <div className="mt-8 text-center text-sm text-gray-500">
              <p className="mb-2">Đăng nhập để test:</p>
              <p>Số điện thoại: 0123456789</p>
              <p>Mật khẩu: password</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;