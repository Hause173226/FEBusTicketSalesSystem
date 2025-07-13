import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit, X, Save } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { signoutService } from '../services/signoutService';
import { userServices } from '../services/userServices';
import { getBookingHistoryByCustomer } from '../services/bookingServices';
import { Profile, Booking } from '../types';
import { toast } from 'react-hot-toast';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileAvatarUploader from '../components/profile/ProfileAvatarUploader';
import ProfileView from '../components/profile/ProfileView';
import ProfileForm from '../components/profile/ProfileForm';
import BookingHistory from '../components/profile/BookingHistory';

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
    avatar: '',
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
        avatar: profile.avatar || '',
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
  
  const handlePaste = async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData(prev => ({ ...prev, avatar: reader.result as string }));
          };
          reader.readAsDataURL(file);
          break;
        }
      }
    }
  };

  useEffect(() => {
    // Add paste event listener when editing is enabled
    if (isEditing) {
      window.addEventListener('paste', handlePaste);
    }
    
    // Cleanup listener when component unmounts or editing is disabled
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [isEditing]);

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
      const response = await userServices.updateProfile({ ...formData, avatar: formData.avatar });
      setProfile({ ...profile, ...response.data });
      setIsEditing(false);
      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin!');
    }
  };
  
  const handleLogout = async () => {
    try {
      const result = await signoutService.handleSignout();
      logout();
      navigate('/');
      
      if (!result.success) {
        // Signout failed but we'll still logout locally
      }
    } catch (error) {
      logout();
      navigate('/');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <ProfileSidebar
            profile={profile}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
          />
          
          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'profile' ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800">Thông tin cá nhân</h2>
                    {!isEditing ? (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </button>
                    ) : (
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Hủy
                        </button>
                        <button 
                          onClick={handleSubmit}
                          className="flex items-center px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Lưu thay đổi
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Avatar upload */}
                  {isEditing && (
                    <ProfileAvatarUploader
                      formData={formData}
                      setFormData={setFormData}
                    />
                  )}

                  {!isEditing ? (
                    <ProfileView profile={profile} />
                  ) : (
                    <ProfileForm
                      formData={formData}
                      onSubmit={handleSubmit}
                      onChange={handleInputChange}
                    />
                  )}
                </div>
              ) : (
                <BookingHistory
                  isLoading={isLoadingBookings}
                  bookings={userBookings}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;