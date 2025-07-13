import React from 'react';
import { Profile } from '../../types';

interface ProfileFormProps {
  formData: Profile;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  formData,
  onSubmit,
  onChange
}) => {
  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
        <input
          id="fullName"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Nhập họ và tên"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
        <input
          id="phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Nhập số điện thoại"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Nhập địa chỉ email"
        />
      </div>
      <div>
        <label htmlFor="citizenId" className="block text-sm font-medium text-gray-700 mb-2">CCCD/CMND</label>
        <input
          id="citizenId"
          type="text"
          name="citizenId"
          value={formData.citizenId}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Nhập số CCCD/CMND"
        />
      </div>
      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
        <input
          id="dateOfBirth"
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          title="Chọn ngày sinh"
        />
      </div>
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          title="Chọn giới tính"
        >
          <option value="">Chọn giới tính</option>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
        <input
          id="address"
          type="text"
          name="address"
          value={formData.address}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Nhập địa chỉ"
        />
      </div>
    </form>
  );
};

export default ProfileForm;
