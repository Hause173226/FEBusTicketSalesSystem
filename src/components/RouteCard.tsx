import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Truck, CalendarIcon } from 'lucide-react';
import { formatPrice } from '../utils/data';
const RouteCard = ({
  route
}) => {
  return <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 overflow-hidden">
        <img src={route.image} alt={`${route.from} đến ${route.to}`} className="w-full h-full object-cover transition-transform hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold flex items-center">
            {route.from}
            <ArrowRight size={18} className="mx-2 text-gray-400" />
            {route.to}
          </h3>
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Truck size={16} className="mr-2" />
            <span>
              {route.busCompany} • {route.busType}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock size={16} className="mr-2" />
            <span>
              {route.duration} • {route.distance}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <CalendarIcon size={16} className="mr-2" />
            <span>
              Giờ khởi hành: {route.departureTime[0]}
              {route.departureTime.length > 1 ? `, ${route.departureTime[1]}...` : ''}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-blue-600 font-bold text-xl">
            {formatPrice(route.price)}
          </div>
          <Link to={`/booking/${route.id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
            Đặt vé
          </Link>
        </div>
      </div>
    </div>;
};
export default RouteCard;