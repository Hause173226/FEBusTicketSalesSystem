import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Ticket, Edit, LogOut } from 'lucide-react'; 
import TicketCard from '../components/TicketCard';
import { useAppContext } from '../context/AppContext';
import { signoutService } from '../services/signoutService';

const ProfilePage: React.FC = () => {
  const { user, isLoggedIn, logout } = useAppContext();
  const [activeTab, setActiveTab] = useState<'profile' | 'tickets'>('profile');
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 mt-16 text-center">
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }
  
  const handleLogout = async () => {
    try {
      const result = await signoutService.handleSignout();
      logout();
      navigate('/');
      
      if (!result.success) {
        // You could show a toast message here if needed
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error signing out:', error);
      // Still logout and navigate even if there's an error
      logout();
      navigate('/');
    }
  };
  
  return (
    <div className="pt-16 pb-12">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Tài khoản của tôi</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-64">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 bg-blue-700 text-white">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-700 text-2xl font-bold mb-4">
                    {user.fullName.charAt(0)}
                  </div>
                  <h2 className="text-lg font-semibold">{user.fullName}</h2>
                  <p className="text-blue-100">{user.email}</p>
                </div>
              </div>
              
              <div className="p-4">
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full px-4 py-2 rounded-md text-left flex items-center ${
                        activeTab === 'profile'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <User className="h-5 w-5 mr-2" />
                      Thông tin cá nhân
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('tickets')}
                      className={`w-full px-4 py-2 rounded-md text-left flex items-center ${
                        activeTab === 'tickets'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Ticket className="h-5 w-5 mr-2" />
                      Vé đã đặt
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 rounded-md text-left text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'profile' ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Thông tin cá nhân</h2>
                    <button className="flex items-center text-blue-700 hover:underline">
                      <Edit className="h-4 w-4 mr-1" />
                      Chỉnh sửa
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500">Mã người dùng</p>
                      <p className="font-medium text-gray-800">{user._id || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Họ và tên</p>
                      <p className="font-medium text-gray-800">{user.fullName || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Số điện thoại</p>
                      <p className="font-medium text-gray-800">{user.phone || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-800">{user.email || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">CCCD/CMND</p>
                      <p className="font-medium text-gray-800">{user.citizenId || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ngày sinh</p>
                      <p className="font-medium text-gray-800">{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Giới tính</p>
                      <p className="font-medium text-gray-800">{user.gender || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vai trò</p>
                      <p className="font-medium text-gray-800">{user.role || 'Chưa cập nhật'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Địa chỉ</p>
                      <p className="font-medium text-gray-800">{user.address || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Vé đã đặt</h2>
                    <p className="text-gray-600">
                      Quản lý tất cả các vé bạn đã đặt
                    </p>
                  </div>
                  
                  {user.bookings.length > 0 ? (
                    <div className="space-y-6">
                      {user.bookings.map((booking) => (
                        <TicketCard key={booking._id} booking={booking} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                      <Ticket className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Chưa có vé nào</h3>
                      <p className="text-gray-600 mb-4">
                        Bạn chưa đặt vé nào. Hãy đặt vé ngay để bắt đầu hành trình của bạn.
                      </p>
                      <button
                        onClick={() => navigate('/routes')}
                        className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors duration-200"
                      >
                        Đặt vé ngay
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;