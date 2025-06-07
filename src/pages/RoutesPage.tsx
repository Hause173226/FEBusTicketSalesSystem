import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import SearchForm from '../components/SearchForm';
import RouteCard from '../components/RouteCard';
import { Route } from '../types';
import { routes } from '../data';
import { useAppContext } from '../context/AppContext';

const RoutesPage: React.FC = () => {
  const { searchParams } = useAppContext();
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 2000000],
    companies: [] as string[],
    busTypes: [] as string[],
    departureTime: [] as string[],
  });

  // Get unique companies and bus types for filters
  const companies = Array.from(new Set(routes.map(route => route.company)));
  const busTypes = Array.from(new Set(routes.map(route => route.busType)));
  
  // Departure time ranges
  const departureTimeRanges = [
    'Sáng sớm (00:00 - 06:00)',
    'Buổi sáng (06:00 - 12:00)',
    'Buổi chiều (12:00 - 18:00)',
    'Buổi tối (18:00 - 24:00)',
  ];

  useEffect(() => {
    let result = routes;
    
    // Filter by search params
    if (searchParams.from && searchParams.to) {
      result = result.filter(route => 
        route.from.toLowerCase() === searchParams.from.toLowerCase() && 
        route.to.toLowerCase() === searchParams.to.toLowerCase()
      );
    }
    
    // Filter by price range
    result = result.filter(route => 
      route.price >= filters.priceRange[0] && route.price <= filters.priceRange[1]
    );
    
    // Filter by companies
    if (filters.companies.length > 0) {
      result = result.filter(route => filters.companies.includes(route.company));
    }
    
    // Filter by bus types
    if (filters.busTypes.length > 0) {
      result = result.filter(route => filters.busTypes.includes(route.busType));
    }
    
    // Filter by departure time
    if (filters.departureTime.length > 0) {
      result = result.filter(route => {
        const hour = parseInt(route.departureTime.split(':')[0]);
        
        return filters.departureTime.some(timeRange => {
          if (timeRange === 'Sáng sớm (00:00 - 06:00)') {
            return hour >= 0 && hour < 6;
          } else if (timeRange === 'Buổi sáng (06:00 - 12:00)') {
            return hour >= 6 && hour < 12;
          } else if (timeRange === 'Buổi chiều (12:00 - 18:00)') {
            return hour >= 12 && hour < 18;
          } else if (timeRange === 'Buổi tối (18:00 - 24:00)') {
            return hour >= 18 && hour < 24;
          }
          return false;
        });
      });
    }
    
    setFilteredRoutes(result);
  }, [searchParams, filters]);

  const handleCompanyChange = (company: string) => {
    setFilters(prev => {
      const newCompanies = prev.companies.includes(company)
        ? prev.companies.filter(c => c !== company)
        : [...prev.companies, company];
      
      return { ...prev, companies: newCompanies };
    });
  };

  const handleBusTypeChange = (busType: string) => {
    setFilters(prev => {
      const newBusTypes = prev.busTypes.includes(busType)
        ? prev.busTypes.filter(t => t !== busType)
        : [...prev.busTypes, busType];
      
      return { ...prev, busTypes: newBusTypes };
    });
  };

  const handleDepartureTimeChange = (timeRange: string) => {
    setFilters(prev => {
      const newDepartureTimes = prev.departureTime.includes(timeRange)
        ? prev.departureTime.filter(t => t !== timeRange)
        : [...prev.departureTime, timeRange];
      
      return { ...prev, departureTime: newDepartureTimes };
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setFilters(prev => ({
      ...prev,
      priceRange: [0, value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 2000000],
      companies: [],
      busTypes: [],
      departureTime: [],
    });
  };

  return (
    <div className="pt-16 pb-12">
      {/* Search Form Section */}
      <section className="bg-blue-700 py-12">
        <div className="container mx-auto px-4">
          <SearchForm className="mb-0" />
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters (Mobile Toggle) */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm flex items-center justify-center"
            >
              {showFilters ? (
                <>
                  <X className="h-5 w-5 mr-2" />
                  Ẩn bộ lọc
                </>
              ) : (
                <>
                  <Filter className="h-5 w-5 mr-2" />
                  Hiển thị bộ lọc
                </>
              )}
            </button>
          </div>
          
          {/* Filters (Sidebar) */}
          <motion.div
            className={`bg-white rounded-lg shadow-md p-6 h-fit ${showFilters ? 'block' : 'hidden'} md:block`}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ flex: '0 0 300px' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Bộ lọc tìm kiếm</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:underline"
              >
                Xóa bộ lọc
              </button>
            </div>
            
            {/* Price Range Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">Khoảng giá</h4>
              <input
                type="range"
                min="0"
                max="2000000"
                step="50000"
                value={filters.priceRange[1]}
                onChange={handlePriceChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>0đ</span>
                <span>{new Intl.NumberFormat('vi-VN').format(filters.priceRange[1])}đ</span>
              </div>
            </div>
            
            {/* Companies Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">Nhà xe</h4>
              <div className="space-y-2">
                {companies.map((company) => (
                  <label key={company} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.companies.includes(company)}
                      onChange={() => handleCompanyChange(company)}
                      className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="ml-2 text-gray-700">{company}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Bus Type Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">Loại xe</h4>
              <div className="space-y-2">
                {busTypes.map((busType) => (
                  <label key={busType} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.busTypes.includes(busType)}
                      onChange={() => handleBusTypeChange(busType)}
                      className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="ml-2 text-gray-700">{busType}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Departure Time Filter */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Giờ khởi hành</h4>
              <div className="space-y-2">
                {departureTimeRanges.map((timeRange) => (
                  <label key={timeRange} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.departureTime.includes(timeRange)}
                      onChange={() => handleDepartureTimeChange(timeRange)}
                      className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="ml-2 text-gray-700">{timeRange}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Search Results */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {searchParams.from && searchParams.to ? (
                  <>
                    Kết quả tìm kiếm từ <span className="text-blue-700">{searchParams.from}</span> đến <span className="text-blue-700">{searchParams.to}</span>
                  </>
                ) : (
                  'Tất cả tuyến xe'
                )}
              </h2>
              
              <p className="text-gray-600">
                Tìm thấy {filteredRoutes.length} tuyến xe
              </p>
            </div>
            
            {filteredRoutes.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredRoutes.map((route) => (
                  <RouteCard key={route.id} route={route} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Không tìm thấy tuyến xe</h3>
                <p className="text-gray-600 mb-4">
                  Không có tuyến xe nào phù hợp với tìm kiếm của bạn. Vui lòng thử lại với các điều kiện khác.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors duration-200"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutesPage;