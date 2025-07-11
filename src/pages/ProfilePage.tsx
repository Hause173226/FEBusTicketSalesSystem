import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Ticket, Edit, LogOut, Save, X, Camera } from 'lucide-react'; 
import TicketCard from '../components/TicketCard';
import { useAppContext } from '../context/AppContext';
import { signoutService } from '../services/signoutService';
import { userServices } from '../services/userServices';
import { getBookingHistoryByCustomer } from '../services/bookingServices';
import { Profile, Booking } from '../types';
import { toast } from 'react-hot-toast';
import { saveProfileImage } from '../utils/profileImageUtils';

const ProfilePage: React.FC = () => {
  const { profile, isLoggedIn, logout, setProfile } = useAppContext();
  const [activeTab, setActiveTab] = useState<'profile' | 'tickets'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      const updatedProfile = { ...profile, ...response.data };
      setProfile(updatedProfile);
      
      // Also update localStorage to persist the changes
      localStorage.setItem('profile', JSON.stringify(updatedProfile));
      
      setIsEditing(false);
      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin!');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh!');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 5MB!');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploadingImage(true);
    try {
      let response;
      try {
        // Try with 'image' field first
        response = await userServices.uploadProfileImage(file);
      } catch (firstError: any) {
        console.log('First upload attempt failed, trying alternative method...');
        // If first attempt fails, try with 'file' field
        response = await userServices.uploadProfileImageAlt(file);
      }
      
      console.log('Upload response:', response.data); // Debug log
      
      // Handle different response formats
      let imageUrl = '';
      if (response.data) {
        // Try different possible response formats
        imageUrl = response.data.imageUrl || 
                  response.data.url || 
                  response.data.filePath || 
                  response.data.data?.imageUrl ||
                  response.data.data?.url;
      }
      
      if (imageUrl) {
        const updatedProfile = { ...profile, profileImage: imageUrl };
        setProfile(updatedProfile);
        
        // Also update localStorage to persist the image
        localStorage.setItem('profile', JSON.stringify(updatedProfile));
        
        // Save image separately for persistence across sessions
        if (profile?._id) {
          saveProfileImage(profile._id, imageUrl);
        }
        
        setPreviewImage(null); // Clear preview after successful upload
        toast.success('Cập nhật ảnh đại diện thành công!');
      } else {
        console.error('No image URL found in response:', response.data);
        toast.error('Không thể lấy URL ảnh từ server!');
        setPreviewImage(null);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setPreviewImage(null);
      
      // More specific error messages
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error;
        
        if (status === 500) {
          toast.error(`Lỗi server: ${message || 'Vui lòng thử lại sau'}`);
        } else if (status === 413) {
          toast.error('File quá lớn, vui lòng chọn file khác!');
        } else if (status === 415) {
          toast.error('Định dạng file không được hỗ trợ!');
        } else {
          toast.error(`Lỗi: ${message || 'Có lỗi xảy ra khi tải ảnh lên'}`);
        }
      } else {
        toast.error('Không thể kết nối đến server!');
      }
    } finally {
      setIsUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageClick = () => {
    if (profile.profileImage) {
      setShowImageModal(true);
    }
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showImageModal) {
        closeImageModal();
      }
    };

    if (showImageModal) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset'; // Restore scrolling
    };
  }, [showImageModal]);
  
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
    <div className="pt-16 pb-12">
      <div className="container mx-auto px-4 py-8">
        
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-64">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 bg-blue-700 text-white">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div 
                      className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-700 text-2xl font-bold mb-4 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={handleImageClick}
                      title={profile.profileImage ? "Click để xem ảnh phóng to" : "Chưa có ảnh đại diện"}
                    >
                      {previewImage ? (
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="w-full h-full object-cover opacity-70"
                        />
                      ) : profile.profileImage ? (
                        <img 
                          src={profile.profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      ) : (
                        profile.fullName?.charAt(0) || 'U'
                      )}
                    </div>
                    <button
                      onClick={triggerFileInput}
                      disabled={isUploadingImage}
                      className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-800 text-white rounded-full p-2 transition-colors duration-200 disabled:opacity-50"
                      title="Thay đổi ảnh đại diện"
                    >
                      {isUploadingImage ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      title="Chọn ảnh đại diện"
                    />
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
                        <label htmlFor="fullName" className="block text-sm text-gray-500 mb-1">Họ và tên</label>
                        <input
                          id="fullName"
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                          placeholder="Nhập họ và tên"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm text-gray-500 mb-1">Số điện thoại</label>
                        <input
                          id="phone"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm text-gray-500 mb-1">Email</label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                          placeholder="Nhập địa chỉ email"
                        />
                      </div>
                      <div>
                        <label htmlFor="citizenId" className="block text-sm text-gray-500 mb-1">CCCD/CMND</label>
                        <input
                          id="citizenId"
                          type="text"
                          name="citizenId"
                          value={formData.citizenId}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                          placeholder="Nhập số CCCD/CMND"
                        />
                      </div>
                      <div>
                        <label htmlFor="dateOfBirth" className="block text-sm text-gray-500 mb-1">Ngày sinh</label>
                        <input
                          id="dateOfBirth"
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                          title="Chọn ngày sinh"
                        />
                      </div>
                      <div>
                        <label htmlFor="gender" className="block text-sm text-gray-500 mb-1">Giới tính</label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                          title="Chọn giới tính"
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm text-gray-500 mb-1">Địa chỉ</label>
                        <input
                          id="address"
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                          placeholder="Nhập địa chỉ"
                        />
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Vé đã đặt</h2>
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
      
      {/* Image Modal */}
      {showImageModal && profile.profileImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeImageModal}
        >
          <div 
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all z-10"
              title="Đóng"
            >
              <X className="h-6 w-6" />
            </button>
            <img 
              src={profile.profileImage} 
              alt="Profile Image" 
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;