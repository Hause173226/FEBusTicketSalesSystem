import React from 'react';
import {  Bell, LogOut } from 'lucide-react';
import { User } from '../../types';

interface DashboardHeaderProps {
  user: User;
  onMenuClick: () => void;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-md fixed w-full z-50">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none relative">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none"
                title="Đăng xuất"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader; 