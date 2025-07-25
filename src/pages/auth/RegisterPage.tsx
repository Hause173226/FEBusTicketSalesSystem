import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { userServices } from '../../services/userServices';
import { validatePassword } from '../../utils/authUtils';
import toast from 'react-hot-toast';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }

    // Validate password if the field is password
    if (name === 'password') {
      if (value) {
        const { errors } = validatePassword(value);
        setPasswordErrors(errors);
      } else {
        setPasswordErrors([]);
      }
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else {
      const { isValid, errors } = validatePassword(formData.password);
      if (!isValid) {
        setPasswordErrors(errors);
        return false;
      }
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu nhập lại không khớp';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && passwordErrors.length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      await userServices.register(
        formData.name,
        formData.phone,
        formData.email,
        formData.password
      );
      
      // Show success toast
      toast.success('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.', {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
        },
      });

      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 1000);
      
    } catch (err: any) {
      setErrors({
        ...errors,
        form: err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại sau.',
      });
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
            <h2 className="text-2xl font-bold">Đăng ký tài khoản</h2>
            <p className="mt-1">Tạo tài khoản để đặt vé và sử dụng đầy đủ dịch vụ</p>
          </div>
          
          <div className="p-6">
            {errors.form && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <p className="text-red-700 text-sm">{errors.form}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nguyễn Văn A"
                  />
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="example@email.com"
                  />
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0901234567"
                  />
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password || passwordErrors.length > 0 ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <FaRegEyeSlash className="h-5 w-5" /> : <FaRegEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                {passwordErrors.length > 0 && (
                  <div className="mt-2 text-sm text-red-600">
                    <ul className="list-disc list-inside space-y-1">
                      {passwordErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Nhập lại mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <FaRegEyeSlash className="h-5 w-5" /> : <FaRegEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-md transition-colors duration-200 flex items-center justify-center ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-700 hover:bg-blue-800 text-white'
                }`}
              >
                {loading ? 'Đang xử lý...' : (
                  <>
                    Đăng ký
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-blue-700 hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;