import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { cities } from '../data';
import { useAppContext } from '../context/AppContext';

const SearchForm: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { searchParams, updateSearchParams } = useAppContext();
  const [fromCity, setFromCity] = useState(searchParams.from || '');
  const [toCity, setToCity] = useState(searchParams.to || '');
  const [departureDate, setDepartureDate] = useState<Date | null>(searchParams.date || null);
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  
  const navigate = useNavigate();

  const filteredFromCities = cities.filter(city => 
    city.name.toLowerCase().includes(fromQuery.toLowerCase())
  );
  
  const filteredToCities = cities.filter(city => 
    city.name.toLowerCase().includes(toQuery.toLowerCase())
  );

  const handleFromCitySelect = (cityName: string) => {
    setFromCity(cityName);
    setFromQuery(cityName);
    setIsFromDropdownOpen(false);
  };

  const handleToCitySelect = (cityName: string) => {
    setToCity(cityName);
    setToQuery(cityName);
    setIsToDropdownOpen(false);
  };

  const handleSwapCities = () => {
    setFromCity(toCity);
    setToCity(fromCity);
    setFromQuery(toCity);
    setToQuery(fromCity);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fromCity || !toCity || !departureDate) {
      alert('Vui lòng điền đầy đủ thông tin tìm kiếm');
      return;
    }
    
    updateSearchParams({
      from: fromCity,
      to: toCity,
      date: departureDate,
    });
    
    navigate('/routes');
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
          {/* From City */}
          <div className="relative md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Điểm đi</label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Chọn điểm đi"
                value={fromQuery}
                onChange={(e) => {
                  setFromQuery(e.target.value);
                  setIsFromDropdownOpen(true);
                }}
                onFocus={() => setIsFromDropdownOpen(true)}
              />
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              
              {isFromDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {filteredFromCities.length > 0 ? (
                    filteredFromCities.map((city) => (
                      <div
                        key={city.id}
                        className="p-3 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleFromCitySelect(city.name)}
                      >
                        {city.name}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-gray-500">Không tìm thấy thành phố</div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Swap Button */}
          <div className="flex items-center justify-center md:col-span-1">
            <button
              type="button"
              onClick={handleSwapCities}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <ArrowRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          {/* To City */}
          <div className="relative md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Điểm đến</label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Chọn điểm đến"
                value={toQuery}
                onChange={(e) => {
                  setToQuery(e.target.value);
                  setIsToDropdownOpen(true);
                }}
                onFocus={() => setIsToDropdownOpen(true)}
              />
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              
              {isToDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {filteredToCities.length > 0 ? (
                    filteredToCities.map((city) => (
                      <div
                        key={city.id}
                        className="p-3 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleToCitySelect(city.name)}
                      >
                        {city.name}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-gray-500">Không tìm thấy thành phố</div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Departure Date */}
          <div className="relative md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đi</label>
            <div className="relative">
              <DatePicker
                selected={departureDate}
                onChange={(date) => setDepartureDate(date)}
                minDate={new Date()}
                className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholderText="Chọn ngày"
                dateFormat="dd/MM/yyyy"
              />
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Search Button */}
        <button
          type="submit"
          className="mt-6 w-full bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors duration-200 flex items-center justify-center"
        >
          <Search className="h-5 w-5 mr-2" />
          Tìm chuyến xe
        </button>
      </form>
    </motion.div>
  );
};

export default SearchForm;