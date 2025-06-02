import React, { useState } from 'react';
import { cities, routes, trips, getRoute } from '../../utils/mockData';
import { SearchIcon, CalendarIcon, ClockIcon, ArrowRightIcon, MapPinIcon, DollarSignIcon } from 'lucide-react';
export const SearchRoutes = () => {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredTrips = trips.filter(trip => {
      const route = getRoute(trip.routeId);
      return (!departure || route?.departureCity === departure) && (!arrival || route?.arrivalCity === arrival) && (!date || trip.date === date);
    }).map(trip => {
      const route = getRoute(trip.routeId);
      return {
        ...trip,
        departureCity: route?.departureCity,
        arrivalCity: route?.arrivalCity,
        price: route?.price,
        duration: route?.duration
      };
    });
    setSearchResults(filteredTrips.slice(0, 10));
    setSearched(true);
  };
  return <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Find Your Perfect Route
        </h1>
        <p className="text-white/70">
          Search for available bus routes and schedules
        </p>
      </div>
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <label className="block text-white/80 text-sm mb-1">From</label>
            <div className="relative">
              <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none" value={departure} onChange={e => setDeparture(e.target.value)}>
                <option value="" className="bg-gray-900">
                  Select departure city
                </option>
                {cities.map(city => <option key={city} value={city} className="bg-gray-900">
                    {city}
                  </option>)}
              </select>
              <MapPinIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
            </div>
          </div>
          <div className="relative">
            <label className="block text-white/80 text-sm mb-1">To</label>
            <div className="relative">
              <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none" value={arrival} onChange={e => setArrival(e.target.value)}>
                <option value="" className="bg-gray-900">
                  Select arrival city
                </option>
                {cities.map(city => <option key={city} value={city} className="bg-gray-900">
                    {city}
                  </option>)}
              </select>
              <MapPinIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
            </div>
          </div>
          <div className="relative">
            <label className="block text-white/80 text-sm mb-1">
              Travel Date
            </label>
            <div className="relative">
              <input type="date" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" value={date} onChange={e => setDate(e.target.value)} />
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
            </div>
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-center">
              <SearchIcon className="h-5 w-5 mr-2" />
              Search Routes
            </button>
          </div>
        </form>
      </div>
      {searched && <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {searchResults.length > 0 ? 'Available Routes' : 'No routes found'}
          </h2>
          <div className="space-y-4">
            {searchResults.map(result => <div key={result.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.01]">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div className="col-span-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-2"></div>
                      <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <div>
                        <p className="text-white font-medium">
                          {result.departureCity}
                        </p>
                        <div className="flex items-center text-white/60 text-sm">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {result.departureTime}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">
                          {result.arrivalCity}
                        </p>
                        <div className="flex items-center justify-end text-white/60 text-sm">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {result.arrivalTime}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-white/70 text-sm">Duration</p>
                    <p className="text-white font-medium">
                      {result.duration} hrs
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/70 text-sm">Available Seats</p>
                    <p className="text-white font-medium">
                      {result.availableSeats}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Price</p>
                        <p className="text-white font-bold">${result.price}</p>
                      </div>
                      <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center">
                        Book <ArrowRightIcon className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
        </div>}
    </div>;
};