import React, { useState } from 'react';
import { SearchIcon, CalendarIcon, UsersIcon } from 'lucide-react';
const SearchForm = ({
  onSearch
}) => {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1
  });
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    onSearch(searchParams);
  };
  const cities = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Đà Lạt', 'Nha Trang', 'Huế', 'Vũng Tàu'];
  return <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
            Điểm đi
          </label>
          <select id="from" name="from" value={searchParams.from} onChange={handleChange} className="block w-full rounded-md border-gray-300 py-3 px-4 border focus:border-blue-500 focus:ring-blue-500" required>
            <option value="">Chọn điểm đi</option>
            {cities.map(city => <option key={`from-${city}`} value={city}>
                {city}
              </option>)}
          </select>
        </div>
        <div className="relative">
          <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
            Điểm đến
          </label>
          <select id="to" name="to" value={searchParams.to} onChange={handleChange} className="block w-full rounded-md border-gray-300 py-3 px-4 border focus:border-blue-500 focus:ring-blue-500" required>
            <option value="">Chọn điểm đến</option>
            {cities.map(city => <option key={`to-${city}`} value={city}>
                {city}
              </option>)}
          </select>
        </div>
        <div className="relative">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Ngày đi
          </label>
          <div className="relative">
            <input type="date" id="date" name="date" value={searchParams.date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} className="block w-full rounded-md border-gray-300 py-3 px-4 border focus:border-blue-500 focus:ring-blue-500" required />
            <CalendarIcon size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="relative">
          <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
            Số hành khách
          </label>
          <div className="relative">
            <select id="passengers" name="passengers" value={searchParams.passengers} onChange={handleChange} className="block w-full rounded-md border-gray-300 py-3 px-4 border focus:border-blue-500 focus:ring-blue-500">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => <option key={num} value={num}>
                  {num} hành khách
                </option>)}
            </select>
            <UsersIcon size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center gap-2 transition-colors">
          <SearchIcon size={18} />
          Tìm chuyến xe
        </button>
      </div>
    </form>;
};
export default SearchForm;