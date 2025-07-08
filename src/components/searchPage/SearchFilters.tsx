import React from 'react';
import { Clock, Filter, DollarSign } from 'lucide-react';

interface SearchFiltersProps {
  selectedTimeSlots: string[];
  setSelectedTimeSlots: (slots: string[]) => void;
  priceRange: { min: number; max: number };
  onPriceRangeChange: (type: 'min' | 'max', value: number) => void;
  onFiltersReset: () => void;
  onFilterChange?: () => void;
  isUserInteracted: boolean;
  actualMaxPrice: number;
  defaultMinPrice: number;
  defaultMaxPrice: number;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  selectedTimeSlots,
  setSelectedTimeSlots,
  priceRange,
  onPriceRangeChange,
  onFiltersReset,
  onFilterChange,
  isUserInteracted,
  actualMaxPrice,
  defaultMinPrice,
  defaultMaxPrice
}) => {
  const timeSlots = [
    { label: 'Sáng sớm (05:00 - 08:00)', value: 'early-morning', start: 5, end: 8 },
    { label: 'Buổi sáng (08:00 - 12:00)', value: 'morning', start: 8, end: 12 },
    { label: 'Buổi chiều (12:00 - 18:00)', value: 'afternoon', start: 12, end: 18 },
    { label: 'Buổi tối (18:00 - 22:00)', value: 'evening', start: 18, end: 22 },
    { label: 'Đêm (22:00 - 05:00)', value: 'night', start: 22, end: 29 }
  ];

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getEffectiveMaxPrice = () => {
    return defaultMaxPrice;
  };

  const getDisplayMaxPrice = () => {
    return priceRange.max;
  };

  const handleTimeSlotChange = (slotValue: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedTimeSlots([...selectedTimeSlots, slotValue]);
    } else {
      setSelectedTimeSlots(selectedTimeSlots.filter(s => s !== slotValue));
    }
    onFilterChange?.();
  };

  return (
    <div className="w-80 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
        <div className="flex items-center gap-2 mb-6">
          <Filter className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Bộ lọc tìm kiếm</h3>
        </div>

        {/* Time Filter */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            Giờ khởi hành
          </h4>
          <div className="space-y-3">
            {timeSlots.map((slot) => (
              <label key={slot.value} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={selectedTimeSlots.includes(slot.value)}
                  onChange={(e) => handleTimeSlotChange(slot.value, e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 text-sm">{slot.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Reset Filters */}
        <div className="mb-6">
          <button
            onClick={onFiltersReset}
            className="w-full py-2 px-4 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Xóa bộ lọc
          </button>
        </div>

        {/* Price Filter */}
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-blue-600" />
            Giá vé
          </h4>
          <div className="space-y-4">
            {/* Range Slider */}
            <div className="range-slider px-2">
              <div className="relative h-6">
                {/* Track Background */}
                <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-gray-200 rounded-full"></div>
                
                {/* Active track */}
                <div 
                  className="range-active-track"
                  style={{
                    '--track-left': `${((priceRange.min - defaultMinPrice) / (getEffectiveMaxPrice() - defaultMinPrice)) * 100}%`,
                    '--track-width': `${((getDisplayMaxPrice() - priceRange.min) / (getEffectiveMaxPrice() - defaultMinPrice)) * 100}%`
                  } as React.CSSProperties}
                />
                
                {/* Min Range Input */}
                <input
                  type="range"
                  min={defaultMinPrice}
                  max={getEffectiveMaxPrice()}
                  value={priceRange.min}
                  onInput={(e) => {
                    onPriceRangeChange('min', parseInt((e.target as HTMLInputElement).value));
                  }}
                  className="range-min"
                  title={`Giá từ: ${formatPrice(priceRange.min)}`}
                />
                
                {/* Max Range Input */}
                <input
                  type="range"
                  min={defaultMinPrice}
                  max={getEffectiveMaxPrice()}
                  value={getDisplayMaxPrice()}
                  onInput={(e) => {
                    onPriceRangeChange('max', parseInt((e.target as HTMLInputElement).value));
                  }}
                  className="range-max"
                  title={`Giá đến: ${formatPrice(getDisplayMaxPrice())}`}
                />
              </div>
            </div>
            
            {/* Price Display */}
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatPrice(priceRange.min)}</span>
              <span>{formatPrice(getDisplayMaxPrice())}</span>
            </div>
            
            {/* Thông báo giới hạn */}
            {isUserInteracted && actualMaxPrice > 2000000 && (
              <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <span className="inline-flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Đã giới hạn giá tối đa 2.000.000 VND để dễ lọc
                </span>
              </div>
            )}
            
            <div className="text-xs text-gray-500 text-center">
              {isUserInteracted && actualMaxPrice > 2000000 && (
                <span className="block mt-1 text-blue-600">
                  (Đang lọc: {formatPrice(defaultMinPrice)} - {formatPrice(defaultMaxPrice)})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
