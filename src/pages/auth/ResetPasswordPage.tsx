import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, ArrowRight, AlertCircle, CheckCircle2, RotateCw } from 'lucide-react';
import { userServices } from '../../services/userServices';

const ResetPasswordPage: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Redirect if no email in state
  if (!email) {
    navigate('/forgot-password');
    return null;
  }

  const handleResendOTP = async () => {
    try {
      setResending(true);
      setError('');
      await userServices.resendOTP(email);
      // Show temporary success message
      const tempError = error;
      setError('Đã gửi lại mã OTP thành công!');
      setTimeout(() => {
        setError(tempError);
      }, 3000);
    } catch (err) {
      setError('Không thể gửi lại mã OTP. Vui lòng thử lại sau.');
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || !newPassword || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await userServices.resetPassword(email, otp, newPassword);
      setSuccess(true);
      
    } catch (err) {
      setError('Không thể đặt lại mật khẩu. Vui lòng kiểm tra mã OTP và thử lại.');
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
            <h2 className="text-2xl font-bold">Đặt lại mật khẩu</h2>
            <p className="mt-1">Nhập mã OTP và mật khẩu mới của bạn</p>
          </div>
          
          <div className="p-6">
            {error && (
              <div className={`border rounded-md p-4 mb-6 flex items-start ${
                error === 'Đã gửi lại mã OTP thành công!'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {error === 'Đã gửi lại mã OTP thành công!' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                )}
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success ? (
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Đặt lại mật khẩu thành công!</h3>
                <p className="text-gray-600 mb-6">
                  Bạn có thể đăng nhập bằng mật khẩu mới.
                </p>
                <Link
                  to="/login"
                  className="text-blue-700 hover:underline flex items-center justify-center"
                >
                  Đăng nhập ngay
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                      Mã OTP
                    </label>
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resending}
                      className="text-sm text-blue-700 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 -mr-2 transition-colors duration-200 flex items-center"
                    >
                      <RotateCw className={`h-4 w-4 mr-1 ${resending ? 'animate-spin' : ''}`} />
                      {resending ? 'Đang gửi...' : 'Gửi lại OTP'}
                    </button>
                  </div>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mã OTP"
                    maxLength={6}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                      minLength={6}
                    />
                    <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                      minLength={6}
                    />
                    <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
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
                      Đặt lại mật khẩu
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

export default ResetPasswordPage; 