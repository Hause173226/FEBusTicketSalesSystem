import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Bus, 
  CreditCard, 
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { routes } from '../data';
import DashboardLayout from '../components/dashboard/DashboardLayout';

const DashboardPage: React.FC = () => {
  const { user, isLoggedIn } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in or not admin
    if (!isLoggedIn || !user?.isAdmin) {
      navigate('/login');
    }
  }, [isLoggedIn, user, navigate]);

  if (!user?.isAdmin) {
    return null;
  }

  // Calculate statistics
  const totalRoutes = routes.length;
  const totalBookings = 150; // Mock data
  const totalRevenue = 45000000; // Mock data
  const activeUsers = 50; // Mock data

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Title */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
          <p className="mt-2 text-sm text-gray-700 sm:mt-0">
            Welcome back, {user?.name}
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
            <p className="text-sm text-green-500 mt-2">+12% from last month</p>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Total Routes</h3>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Bus className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalRoutes}</p>
            <p className="text-sm text-green-500 mt-2">+5 new routes added</p>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
              <div className="p-2 bg-green-50 rounded-lg">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
            <p className="text-sm text-green-500 mt-2">+25% this week</p>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <CreditCard className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            <p className="text-sm text-green-500 mt-2">+18% this month</p>
          </motion.div>
        </div>

        {/* Recent Routes Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Recent Routes</h2>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Add New Route
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {routes.slice(0, 5).map((route) => (
                  <tr key={route.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="font-medium text-gray-900">{route.from}</div>
                          <div className="text-gray-500">{route.to}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{route.company}</div>
                      <div className="text-sm text-gray-500">{route.busType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">{route.departureTime}</div>
                          <div className="text-sm text-gray-500">{route.arrivalTime}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(route.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {route.availableSeats > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Full
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2.5 text-left flex items-center text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <Bus className="h-5 w-5 mr-3 text-blue-600" />
                <span className="font-medium">Manage Routes</span>
              </button>
              <button className="w-full px-4 py-2.5 text-left flex items-center text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <Users className="h-5 w-5 mr-3 text-green-600" />
                <span className="font-medium">Manage Users</span>
              </button>
              <button className="w-full px-4 py-2.5 text-left flex items-center text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <TrendingUp className="h-5 w-5 mr-3 text-yellow-600" />
                <span className="font-medium">View Reports</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Server Status</span>
                <span className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-1.5" />
                  <span className="font-medium">Operational</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Booking System</span>
                <span className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-1.5" />
                  <span className="font-medium">Online</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payment Gateway</span>
                <span className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-1.5" />
                  <span className="font-medium">Active</span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">New booking confirmed</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Bus className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">New route added</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Users className="h-5 w-5 text-purple-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">New user registered</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage; 