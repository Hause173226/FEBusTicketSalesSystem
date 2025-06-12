import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { userServices } from '../../services/userServices';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Vui lòng nhập email');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await userServices.forgotPassword(email);
      
      // Navigate to reset password page with email
      navigate('/reset-password', { state: { email } });
      
    } catch (err) {
      setError('Không thể gửi yêu cầu. Vui lòng kiểm tra lại email của bạn.');
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
            <h2 className="text-2xl font-bold">Quên mật khẩu</h2>
            <p className="mt-1">Nhập email của bạn để nhận mã OTP</p>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {success ? (
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Đã gửi mã OTP!</h3>
                <p className="text-gray-600 mb-6">
                  Chúng tôi đã gửi mã OTP đến email của bạn. Vui lòng kiểm tra hộp thư đến.
                </p>
                <Link
                  to="/login"
                  className="text-blue-700 hover:underline flex items-center justify-center"
                >
                  Quay lại đăng nhập
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="example@email.com"
                    />
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
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
                      Gửi mã OTP
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </button>

                <div className="mt-6 text-center">
                  <Link to="/login" className="text-blue-700 hover:underline">
                    Quay lại đăng nhập
                  </Link>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 