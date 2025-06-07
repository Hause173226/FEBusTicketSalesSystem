import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  Bus,
  Users,
  CreditCard,
  Settings,
  Truck,
  UserCog,
  MessageSquare
} from 'lucide-react';

interface DashboardSidebarProps {
  isOpen: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen }) => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, name: 'Dashboard', path: '/dashboard' },
    { icon: Bus, name: 'Quản lý tuyến xe', path: '/dashboard/routes' },
    { icon: Truck, name: 'Quản lý xe', path: '/dashboard/vehicles' },
    { icon: UserCog, name: 'Quản lý tài xế', path: '/dashboard/drivers' },
    { icon: Users, name: 'Quản lý người dùng', path: '/dashboard/users' },
    { icon: CreditCard, name: 'Quản lý thanh toán', path: '/dashboard/payments' },
    { icon: MessageSquare, name: 'Phản hồi', path: '/dashboard/feedback' },
    { icon: Settings, name: 'Cài đặt', path: '/dashboard/settings' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white shadow-md transition-all duration-300 z-50 ${
        isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'
      } md:translate-x-0`}
    >
      <div className="h-full overflow-y-auto">
        <nav className="py-4">
          <div className="px-4 mb-6 pt-3">
            <h1 className="text-xl font-semibold text-gray-800">BusGo Admin</h1>
          </div>
          <div className="px-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default DashboardSidebar; 