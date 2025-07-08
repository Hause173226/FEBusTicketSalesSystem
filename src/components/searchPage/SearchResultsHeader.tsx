import React from 'react';
import { MapPin, Calendar } from 'lucide-react';

interface SearchResultsHeaderProps {
  groupedTrips: { [key: string]: any[] };
  trips: any[];
  searchParams: any;
}

const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({
  groupedTrips,
  trips,
  searchParams
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Kết quả tìm kiếm</h2>
        <div className="text-gray-600">
          {Object.keys(groupedTrips).length > 0 ? (
            <>
              {Object.values(groupedTrips).reduce((total, trips) => total + trips.length, 0)} chuyến xe từ {trips.length} kết quả
            </>
          ) : (
            `${trips.length} chuyến xe được tìm thấy`
          )}
        </div>
      </div>
      {searchParams && (
        <div className="mt-2 flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{searchParams.from} - {searchParams.to}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(searchParams.date).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultsHeader;
