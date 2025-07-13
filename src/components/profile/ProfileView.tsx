import React from 'react';
import { Profile } from '../../types';

interface ProfileViewProps {
  profile: Profile;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
        <p className="font-medium text-gray-800 text-lg">{profile.fullName || 'Chưa cập nhật'}</p>
      </div>
      <div className="p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
        <p className="font-medium text-gray-800 text-lg">{profile.phone || 'Chưa cập nhật'}</p>
      </div>
      <div className="p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-500 mb-1">Email</p>
        <p className="font-medium text-gray-800 text-lg">{profile.email || 'Chưa cập nhật'}</p>
      </div>
      <div className="p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-500 mb-1">CCCD/CMND</p>
        <p className="font-medium text-gray-800 text-lg">{profile.citizenId || 'Chưa cập nhật'}</p>
      </div>
      <div className="p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-500 mb-1">Ngày sinh</p>
        <p className="font-medium text-gray-800 text-lg">
          {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Chưa cập nhật'}
        </p>
      </div>
      <div className="p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-500 mb-1">Giới tính</p>
        <p className="font-medium text-gray-800 text-lg">{profile.gender || 'Chưa cập nhật'}</p>
      </div>
      <div className="md:col-span-2 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-500 mb-1">Địa chỉ</p>
        <p className="font-medium text-gray-800 text-lg">{profile.address || 'Chưa cập nhật'}</p>
      </div>
    </div>
  );
};

export default ProfileView;
