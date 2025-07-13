import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAppContext } from '../context/AppContext';
import { searchTrips } from '../services/tripServices';
import { StationWithCity } from '../types';
import { getStationsWithCityNames } from '../services/stationServices';
import { toast } from 'react-hot-toast';

const SearchForm: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { searchParams, updateSearchParams } = useAppContext();
  const [fromCity, setFromCity] = useState(searchParams.from || '');
  const [toCity, setToCity] = useState(searchParams.to || '');
  const [departureDate, setDepartureDate] = useState<Date | null>(searchParams.date || null);
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [searchBy, setSearchBy] = useState<'city' | 'station'>('city');
  const [isLoading, setIsLoading] = useState(false);
  const [stations, setStations] = useState<StationWithCity[]>([]);  
  const [isStationsLoading, setIsStationsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch stations with city names when component mounts
  useEffect(() => {
    const fetchStations = async () => {
      setIsStationsLoading(true);
      try {
        const data = await getStationsWithCityNames();
        setStations(data);
      } catch (err) {
        console.error('Failed to fetch stations:', err);
        toast.error('Không thể tải danh sách thành phố. Vui lòng thử lại sau.');
      } finally {
        setIsStationsLoading(false);
      }
    };
    fetchStations();
  }, []);

  // Extract unique city names from stations
  const cityNames = useMemo(() => {
    const set = new Set<string>();
    stations.forEach(station => {
      if (station.address?.city) {
        set.add(station.address.city);
      }
    });
    return Array.from(set).sort();
  }, [stations]);

  // Extract station names for station-based search
  const stationNames = useMemo(() => 
    stations.map(station => station.name).sort(),
    [stations]
  );

  // Filter options based on search type and query
  const filteredFromOptions = useMemo(() => {
    const query = fromQuery.toLowerCase().trim();
    if (searchBy === 'city') {
      return cityNames.filter(city => 
        city.toLowerCase().includes(query)
      );
    }
    return stationNames.filter(name => 
      name.toLowerCase().includes(query)
    );
  }, [searchBy, fromQuery, cityNames, stationNames]);

  const filteredToOptions = useMemo(() => {
    const query = toQuery.toLowerCase().trim();
    if (searchBy === 'city') {
      return cityNames.filter(city => 
        city.toLowerCase().includes(query)
      );
    }
    return stationNames.filter(name => 
      name.toLowerCase().includes(query)
    );
  }, [searchBy, toQuery, cityNames, stationNames]);

  const handleFromCitySelect = (value: string) => {
    if (searchBy === 'city') {
      const station = stations.find(s => s.address.city === value);
      if (station) {
        setFromCity(value);
        setFromQuery(value);
      }
    } else {
      const station = stations.find(s => s.name === value);
      if (station) {
        setFromCity(value);
        setFromQuery(value);
      }
    }
    setIsFromDropdownOpen(false);
  };

  const handleToCitySelect = (value: string) => {
    if (searchBy === 'city') {
      const station = stations.find(s => s.address.city === value);
      if (station) {
        setToCity(value);
        setToQuery(value);
      }
    } else {
      const station = stations.find(s => s.name === value);
      if (station) {
        setToCity(value);
        setToQuery(value);
      }
    }
    setIsToDropdownOpen(false);
  };

  const handleSwapCities = () => {
    const tempFromCity = fromCity;
    const tempToCity = toCity;
    setFromCity(tempToCity);
    setToCity(tempFromCity);
    setFromQuery(tempToCity);
    setToQuery(tempFromCity);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fromCity || !toCity || !departureDate) {
      toast.error('Vui lòng điền đầy đủ thông tin tìm kiếm');
      return;
    }

    setIsLoading(true);
    
    try {
      const year = departureDate.getFullYear();
      const month = String(departureDate.getMonth() + 1).padStart(2, '0');
      const day = String(departureDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const fromValue = searchBy === 'city' 
        ? stations.find(s => s.address.city === fromCity)?.address.city
        : stations.find(s => s.name === fromCity)?.name;
      
      const toValue = searchBy === 'city'
        ? stations.find(s => s.address.city === toCity)?.address.city
        : stations.find(s => s.name === toCity)?.name;

      if (!fromValue || !toValue) {
        toast.error('Không tìm thấy thông tin điểm đi hoặc điểm đến. Vui lòng thử lại.');
        return;
      }

      const result = await searchTrips({
        from: fromValue,
        to: toValue,
        date: formattedDate,
        searchBy
      });

      if (result.length === 0) {
        toast.error(`Không tìm thấy chuyến xe nào từ ${fromValue} đến ${toValue} vào ngày ${formattedDate}`);
        return;
      }

      updateSearchParams({
        from: fromValue,
        to: toValue,
        date: departureDate,
        searchBy
      });

      navigate('/search-results', { 
        state: { 
          searchResults: result,
          searchParams: {
            from: fromValue,
            to: toValue,
            date: formattedDate,
            searchBy
          }
        } 
      });
    } catch (error) {
      console.error('Error searching trips:', error);
      toast.error('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className={`bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl border border-blue-100 p-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Tìm kiếm chuyến xe
        </h2>
        <p className="text-gray-600">Đặt vé xe khách nhanh chóng và tiện lợi</p>
      </div>
      
      <form onSubmit={handleSearch}>
        <div className="space-y-6">
          {/* Search Type Toggle */}
          <div className="flex justify-center">
            <div className="bg-gray-100 p-1 rounded-xl inline-flex space-x-1">
              <label className={`px-6 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                searchBy === 'city' 
                  ? 'bg-white shadow-md text-blue-600 font-medium' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}>
                <input
                  type="radio"
                  className="hidden"
                  name="searchType"
                  value="city"
                  checked={searchBy === 'city'}
                  onChange={(e) => {
                    setSearchBy(e.target.value as 'city' | 'station');
                    setFromQuery('');
                    setToQuery('');
                    setFromCity('');
                    setToCity('');
                  }}
                />
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Tìm theo thành phố
                </span>
              </label>
              <label className={`px-6 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                searchBy === 'station' 
                  ? 'bg-white shadow-md text-blue-600 font-medium' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}>
                <input
                  type="radio"
                  className="hidden"
                  name="searchType"
                  value="station"
                  checked={searchBy === 'station'}
                  onChange={(e) => {
                    setSearchBy(e.target.value as 'city' | 'station');
                    setFromQuery('');
                    setToQuery('');
                    setFromCity('');
                    setToCity('');
                  }}
                />
                <span className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Tìm theo bến xe
                </span>
              </label>
            </div>
          </div>

          {/* Main Search Fields */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
              {/* Date Picker */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  📅 Ngày khởi hành
                </label>
                <div className="relative">
                  <DatePicker
                    selected={departureDate}
                    onChange={(date) => setDepartureDate(date)}
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                    placeholderText="Chọn ngày"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl pl-12 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-700 font-medium"
                  />
                  <Calendar className="absolute left-4 top-4 h-5 w-5 text-blue-500" />
                </div>
              </div>

              {/* From City/Station */}
              <div className="relative lg:col-span-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  🚌 {searchBy === 'city' ? 'Thành phố đi' : 'Bến xe đi'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className={`w-full p-4 border-2 rounded-xl pl-12 transition-all duration-200 text-gray-700 font-medium ${
                      !departureDate 
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400' 
                        : 'border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-300'
                    }`}
                    placeholder={searchBy === 'city' ? "Chọn thành phố đi" : "Chọn bến xe đi"}
                    value={fromQuery}
                    onChange={(e) => {
                      if (!departureDate) return;
                      setFromQuery(e.target.value);
                      setIsFromDropdownOpen(true);
                    }}
                    onFocus={() => {
                      if (!departureDate) return;
                      setIsFromDropdownOpen(true);
                    }}
                    disabled={!departureDate}
                  />
                  <MapPin className={`absolute left-4 top-4 h-5 w-5 ${!departureDate ? 'text-gray-300' : 'text-blue-500'}`} />
                  
                  {isFromDropdownOpen && departureDate && (
                    <div 
                      className="absolute z-20 mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-auto"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {isStationsLoading ? (
                        <div className="p-4 text-gray-500 text-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto mb-2"></div>
                          Đang tải...
                        </div>
                      ) : filteredFromOptions.length > 0 ? (
                        filteredFromOptions.map((option) => (
                          <div
                            key={option}
                            className="p-4 hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                            onClick={() => handleFromCitySelect(option)}
                          >
                            <span className="text-gray-700 font-medium">{option}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-gray-500 text-center">
                          Không tìm thấy {searchBy === 'city' ? 'thành phố' : 'bến xe'} phù hợp
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Swap Button */}
              <div className="lg:col-span-1 flex justify-center">
                <button
                  type="button"
                  title="Đổi điểm đi và điểm đến"
                  className={`p-3 rounded-full transition-all duration-200 ${
                    !departureDate 
                      ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                      : 'hover:bg-blue-100 bg-blue-50 text-blue-600 hover:shadow-md'
                  }`}
                  onClick={handleSwapCities}
                  disabled={!departureDate}
                >
                  <ArrowRight className={`h-6 w-6 transform rotate-90 ${!departureDate ? 'text-gray-300' : 'text-blue-600'}`} />
                </button>
              </div>

              {/* To City/Station */}
              <div className="relative lg:col-span-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  🏁 {searchBy === 'city' ? 'Thành phố đến' : 'Bến xe đến'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className={`w-full p-4 border-2 rounded-xl pl-12 transition-all duration-200 text-gray-700 font-medium ${
                      !departureDate 
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400' 
                        : 'border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-300'
                    }`}
                    placeholder={searchBy === 'city' ? "Chọn thành phố đến" : "Chọn bến xe đến"}
                    value={toQuery}
                    onChange={(e) => {
                      if (!departureDate) return;
                      setToQuery(e.target.value);
                      setIsToDropdownOpen(true);
                    }}
                    onFocus={() => {
                      if (!departureDate) return;
                      setIsToDropdownOpen(true);
                    }}
                    disabled={!departureDate}
                  />
                  <MapPin className={`absolute left-4 top-4 h-5 w-5 ${!departureDate ? 'text-gray-300' : 'text-blue-500'}`} />
                  
                  {isToDropdownOpen && departureDate && (
                    <div 
                      className="absolute z-20 mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-auto"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {isStationsLoading ? (
                        <div className="p-4 text-gray-500 text-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto mb-2"></div>
                          Đang tải...
                        </div>
                      ) : filteredToOptions.length > 0 ? (
                        filteredToOptions.map((option) => (
                          <div
                            key={option}
                            className="p-4 hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                            onClick={() => handleToCitySelect(option)}
                          >
                            <span className="text-gray-700 font-medium">{option}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-gray-500 text-center">
                          Không tìm thấy {searchBy === 'city' ? 'thành phố' : 'bến xe'} phù hợp
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Error Messages */}
          {!departureDate && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Calendar className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 font-medium">
                    Vui lòng chọn ngày khởi hành trước khi chọn điểm đi và điểm đến
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Search Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading || !fromCity || !toCity || !departureDate}
              className={`
                relative overflow-hidden px-12 py-4 rounded-xl font-bold text-lg
                transform transition-all duration-300 min-w-[200px]
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : (!fromCity || !toCity || !departureDate)
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                }
              `}
            >
              <div className="flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Đang tìm kiếm...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-6 w-6" />
                    <span>Tìm chuyến xe</span>
                  </>
                )}
              </div>
              
              {/* Animated background effect */}
              {!isLoading && fromCity && toCity && departureDate && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
              )}
            </button>
          </div>

          {/* Validation Message */}
          {(!fromCity || !toCity || !departureDate) && (
            <div className="text-center">
              <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg inline-block border border-red-200">
                {!departureDate ? '📅 Vui lòng chọn ngày khởi hành' 
                  : !fromCity ? '🚌 Vui lòng chọn điểm đi'
                  : '🏁 Vui lòng chọn điểm đến'}
              </p>
            </div>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default SearchForm;