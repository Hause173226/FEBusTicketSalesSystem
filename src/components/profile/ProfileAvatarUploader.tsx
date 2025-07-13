import React from 'react';
import { Edit, User } from 'lucide-react';
import { Profile } from '../../types';

interface ProfileAvatarUploaderProps {
  formData: Profile;
  setFormData: React.Dispatch<React.SetStateAction<Profile>>;
}

const ProfileAvatarUploader: React.FC<ProfileAvatarUploaderProps> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="flex flex-col items-center mb-8 p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors duration-200">
      <div className="relative group cursor-pointer mb-4">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
          {formData.avatar ? (
            <img 
              src={formData.avatar} 
              alt="Avatar preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-50 flex items-center justify-center">
              <User className="w-16 h-16 text-blue-300" />
            </div>
          )}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-200">
          <div className="text-center">
            <Edit className="w-6 h-6 mx-auto mb-1" />
            <span className="text-sm">Thay đổi</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-1">Cập nhật ảnh đại diện</h3>
        <p className="text-sm text-gray-500 mb-4">
          Chọn ảnh hoặc dán trực tiếp (Ctrl+V)
        </p>
        <div className="relative">
          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setFormData(prev => ({ ...prev, avatar: reader.result as string }));
                };
                reader.readAsDataURL(file);
              }
            }}
            className="hidden"
          />
          <button
            onClick={() => {
              const fileInput = document.getElementById('avatar') as HTMLInputElement;
              fileInput?.click();
            }}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            Chọn ảnh từ máy tính
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileAvatarUploader;
