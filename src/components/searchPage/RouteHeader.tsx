import React from 'react';
import { MapPin, Clock, Bus } from 'lucide-react';
import { Trip } from '../../types';

interface RouteHeaderProps {
  route: any;
  routeTrips: Trip[];
  formatPrice: (price: number) => string;
  formatDuration: (minutes: number) => string;
  getStationName: (station: any) => string;
  getStationAddress: (station: any) => string;
}

const RouteHeader: React.FC<RouteHeaderProps> = ({
  route,
  routeTrips,
  formatPrice,
  formatDuration,
  getStationName,
  getStationAddress
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {getStationName(route?.originStation)} → {getStationName(route?.destinationStation)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Điểm đi:</p>
              <p className="text-xs text-gray-600">{getStationAddress(route?.originStation)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Điểm đến:</p>
              <p className="text-xs text-gray-600">{getStationAddress(route?.destinationStation)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>Tuyến: {route?.name || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(route?.estimatedDuration || 0)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bus className="h-4 w-4" />
              <span>{routeTrips.length} chuyến xe</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-blue-600">
            Từ {formatPrice(Math.min(...routeTrips.map(t => t.basePrice)))}
          </p>
          <p className="text-sm text-gray-600">
            {routeTrips.filter(t => t.availableSeats > 0).length}/{routeTrips.length} chuyến còn chỗ
          </p>
        </div>
      </div>
    </div>
  );
};

export default RouteHeader;
