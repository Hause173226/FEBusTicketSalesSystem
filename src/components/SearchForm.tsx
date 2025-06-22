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
        alert('Không thể tải danh sách thành phố. Vui lòng thử lại sau.');
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
      alert('Vui lòng điền đầy đủ thông tin tìm kiếm');
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
        alert('Không tìm thấy thông tin điểm đi hoặc điểm đến. Vui lòng thử lại.');
        return;
      }

      const result = await searchTrips({
        from: fromValue,
        to: toValue,
        date: formattedDate,
        searchBy
      });

      if (result.length === 0) {
        alert(`Không tìm thấy chuyến xe nào từ ${fromValue} đến ${toValue} vào ngày ${formattedDate}`);
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
      alert('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className={`bg-white rounded-lg shadow-lg p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Tìm kiếm tuyến xe</h2>
      
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-9 gap-4">
          {/* Search Type Toggle */}
          <div className="md:col-span-9 flex gap-4 mb-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
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
              <span className="ml-2">Tìm theo thành phố</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
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
              <span className="ml-2">Tìm theo bến xe</span>
            </label>
          </div>

          {/* From City/Station */}
          <div className="relative md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {searchBy === 'city' ? 'Điểm đi (Thành phố)' : 'Điểm đi (Bến xe)'}
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={searchBy === 'city' ? "Chọn thành phố đi" : "Chọn bến xe đi"}
                value={fromQuery}
                onChange={(e) => {
                  setFromQuery(e.target.value);
                  setIsFromDropdownOpen(true);
                }}
                onFocus={() => setIsFromDropdownOpen(true)}
              />
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              
              {isFromDropdownOpen && (
                <div 
                  className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {isStationsLoading ? (
                    <div className="p-3 text-gray-500">Đang tải...</div>
                  ) : filteredFromOptions.length > 0 ? (
                    filteredFromOptions.map((option) => (
                      <div
                        key={option}
                        className="p-3 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleFromCitySelect(option)}
                      >
                        {option}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-gray-500">
                      Không tìm thấy {searchBy === 'city' ? 'thành phố' : 'bến xe'} phù hợp
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex items-end justify-center pb-3">
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={handleSwapCities}
            >
              <ArrowRight className="h-6 w-6 text-gray-500 transform rotate-90" />
            </button>
          </div>

          {/* To City/Station */}
          <div className="relative md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {searchBy === 'city' ? 'Điểm đến (Thành phố)' : 'Điểm đến (Bến xe)'}
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={searchBy === 'city' ? "Chọn thành phố đến" : "Chọn bến xe đến"}
                value={toQuery}
                onChange={(e) => {
                  setToQuery(e.target.value);
                  setIsToDropdownOpen(true);
                }}
                onFocus={() => setIsToDropdownOpen(true)}
              />
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              
              {isToDropdownOpen && (
                <div 
                  className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {isStationsLoading ? (
                    <div className="p-3 text-gray-500">Đang tải...</div>
                  ) : filteredToOptions.length > 0 ? (
                    filteredToOptions.map((option) => (
                      <div
                        key={option}
                        className="p-3 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleToCitySelect(option)}
                      >
                        {option}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-gray-500">
                      Không tìm thấy {searchBy === 'city' ? 'thành phố' : 'bến xe'} phù hợp
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Date Picker */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày đi
            </label>
            <div className="relative">
              <DatePicker
                selected={departureDate}
                onChange={(date) => setDepartureDate(date)}
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                placeholderText="Chọn ngày"
                className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Search Button */}
          <div className="md:col-span-9">
            <button
              type="submit"
              disabled={isLoading || !fromCity || !toCity || !departureDate}
              className={`
                w-full bg-blue-600 text-white p-4 rounded-lg 
                flex items-center justify-center gap-2 
                transform transition-all duration-200
                ${isLoading 
                  ? 'opacity-70 cursor-not-allowed' 
                  : (!fromCity || !toCity || !departureDate)
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-700 hover:shadow-lg active:scale-98'
                }
              `}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span className="text-lg font-medium">Đang tìm kiếm...</span>
                </>
              ) : (
                <>
                  <Search className="h-6 w-6" />
                  <span className="text-lg font-medium">Tìm chuyến xe</span>
                </>
              )}
            </button>
            {(!fromCity || !toCity || !departureDate) && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {!fromCity ? 'Vui lòng chọn điểm đi' 
                  : !toCity ? 'Vui lòng chọn điểm đến'
                  : 'Vui lòng chọn ngày đi'}
              </p>
            )}
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default SearchForm;