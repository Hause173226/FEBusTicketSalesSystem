import React, { useState } from 'react';
import { User, Ticket, LogOut, X } from 'lucide-react';
import { Profile } from '../../types';

interface ProfileSidebarProps {
  profile: Profile;
  activeTab: 'profile' | 'tickets';
  setActiveTab: (tab: 'profile' | 'tickets') => void;
  onLogout: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  profile,
  activeTab,
  setActiveTab,
  onLogout
}) => {
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  return (
    <>
      <div className="sidebar">
        <div className="sidebar__container bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="sidebar__header p-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <div className="flex flex-col items-center">
              <div 
                className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-blue-700 text-3xl font-bold mb-6 overflow-hidden border-4 border-white shadow-md cursor-pointer"
                onClick={() => profile.avatar && setShowAvatarModal(true)}
              >
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile.fullName?.charAt(0) || "?"
                )}
              </div>
              <h2 className="text-xl font-semibold mb-1">{profile.fullName}</h2>
              <p className="text-blue-100 text-sm">{profile.email}</p>
            </div>
          </div>
          
          <div className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full px-6 py-3 rounded-xl text-left flex items-center transition-all duration-200 ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <User className="h-5 w-5 mr-3" />
                  Thông tin cá nhân
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`w-full px-6 py-3 rounded-xl text-left flex items-center transition-all duration-200 ${
                    activeTab === 'tickets'
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Ticket className="h-5 w-5 mr-3" />
                  Vé đã đặt
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={onLogout}
                  className="w-full px-6 py-3 rounded-xl text-left text-red-600 hover:bg-red-50 flex items-center transition-all duration-200"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Đăng xuất
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Avatar Modal */}
      {showAvatarModal && profile.avatar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="modal__content relative max-w-4xl max-h-[90vh] w-full mx-4">
            <button
              onClick={() => setShowAvatarModal(false)}
              className="modal__close-button absolute -top-10 right-0 text-white hover:text-gray-300"
              title="Close modal"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={profile.avatar}
              alt="Avatar Preview"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSidebar;
