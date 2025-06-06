import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '../../context/AppContext';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import DashboardFooter from './DashboardFooter';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader 
        user={user} 
        onMenuClick={toggleSidebar}
        onLogout={handleLogout}
      />
      
      <DashboardSidebar isOpen={isSidebarOpen} />
      
      <main className={`transition-all duration-300 ${
        isSidebarOpen ? 'md:ml-64' : ''
      }`}>
        <div className="p-8 pt-24 pb-24">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
      
      <DashboardFooter />
    </div>
  );
};

export default DashboardLayout; 