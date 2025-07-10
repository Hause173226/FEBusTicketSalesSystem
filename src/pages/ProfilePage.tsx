import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Ticket, Edit, LogOut, Save, X } from 'lucide-react'; 
import TicketCard from '../components/TicketCard';
import { useAppContext } from '../context/AppContext';
import { signoutService } from '../services/signoutService';
import { userServices } from '../services/userServices';
import { getBookingHistoryByCustomer } from '../services/bookingServices';
import { Profile, Booking } from '../types';
import { toast } from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { profile, isLoggedIn, logout, setProfile } = useAppContext();
  const [activeTab, setActiveTab] = useState<'profile' | 'tickets'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [formData, setFormData] = useState<Profile>({
    _id: '',
    fullName: '',
    phone: '',
    email: '',
    citizenId: '',
    dateOfBirth: '',
    gender: undefined,
    address: '',
    role: '',
    bookings: [],
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        _id: profile._id,
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        email: profile.email || '',
        citizenId: profile.citizenId || '',
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
        gender: profile.gender,
        address: profile.address || '',
        role: profile.role,
        bookings: profile.bookings || [],
      });
    }
  }, [profile]);

  // Function to fetch user bookings
  const fetchUserBookings = async () => {
    if (!isLoggedIn || !profile?._id) return;
    
    setIsLoadingBookings(true);
    try {
      // Use the specific customer booking history API
      const bookings = await getBookingHistoryByCustomer(profile._id);
      setUserBookings(bookings);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      toast.error('Không thể tải danh sách vé đã đặt');
    } finally {
      setIsLoadingBookings(false);
    }
  };

  // Fetch bookings when component mounts or when switching to tickets tab
  useEffect(() => {
    if (activeTab === 'tickets' && isLoggedIn) {
      fetchUserBookings();
    }
  }, [activeTab, isLoggedIn]);
  
  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-16 mt-16 text-center">
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await userServices.updateProfile(formData);
      setProfile({ ...profile, ...response.data });
      setIsEditing(false);
      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin!');
    }
  };
  
  const handleLogout = async () => {
    try {
      const result = await signoutService.handleSignout();
      logout();
      navigate('/');
      
      if (!result.success) {
        console.error(result);
      }
    } catch (error) {
      console.error('Error signing out:', error);
      logout();
      navigate('/');
    }
  };
  
  return (
    <div className="pt-16 pb-12">
      <div className="container mx-auto px-4 py-8">
        
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-64">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 bg-blue-700 text-white">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-700 text-2xl font-bold mb-4">
                    {profile.fullName.charAt(0)}
                  </div>
                  <h2 className="text-lg font-semibold">{profile.fullName}</h2>
                  <p className="text-blue-100">{profile.email}</p>
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
                    {!isEditing ? (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center text-blue-700 hover:underline"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Chỉnh sửa
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="flex items-center text-gray-600 hover:text-gray-800"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Hủy
                        </button>
                        <button 
                          onClick={handleSubmit}
                          className="flex items-center text-green-600 hover:text-green-700"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Lưu
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {!isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500">Họ và tên</p>
                        <p className="font-medium text-gray-800">{profile.fullName || 'Chưa cập nhật'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="font-medium text-gray-800">{profile.phone || 'Chưa cập nhật'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-800">{profile.email || 'Chưa cập nhật'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">CCCD/CMND</p>
                        <p className="font-medium text-gray-800">{profile.citizenId || 'Chưa cập nhật'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ngày sinh</p>
                        <p className="font-medium text-gray-800">{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Chưa cập nhật'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Giới tính</p>
                        <p className="font-medium text-gray-800">{profile.gender || 'Chưa cập nhật'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Địa chỉ</p>
                        <p className="font-medium text-gray-800">{profile.address || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Họ và tên</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Số điện thoại</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">CCCD/CMND</label>
                        <input
                          type="text"
                          name="citizenId"
                          value={formData.citizenId}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Ngày sinh</label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Giới tính</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-500 mb-1">Địa chỉ</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Vé đã đặt</h2>
                    <button 
                      onClick={fetchUserBookings}
                      className="text-blue-700 hover:underline text-sm"
                      disabled={isLoadingBookings}
                    >
                      {isLoadingBookings ? 'Đang tải...' : 'Làm mới'}
                    </button>
                  </div>
                  <div className="space-y-4">
                    {isLoadingBookings ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Đang tải danh sách vé...</p>
                      </div>
                    ) : userBookings && userBookings.length > 0 ? (
                      userBookings.map((booking) => (
                        <TicketCard key={booking._id} booking={booking} />
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">Bạn chưa có vé nào</p>
                    )}
                  </div>
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