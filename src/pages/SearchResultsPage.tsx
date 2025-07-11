import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchForm from '../components/SearchForm';
import SearchFilters from '../components/searchPage/SearchFilters';
import SearchResultsHeader from '../components/searchPage/SearchResultsHeader';
import RouteHeader from '../components/searchPage/RouteHeader';
import TripCard from '../components/searchPage/TripCard';
import LoadingSpinner from '../components/LoadingSpinner';
import NoResults from '../components/searchPage/NoResults';
import { Trip } from '../types';
import { useAppContext } from '../context/AppContext';
import '../styles/RangeSlider.css';

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchResults, searchParams } = location.state || {};
  const trips = searchResults as Trip[] || [];
  const { setSelectedTrip } = useAppContext();

  // Filter states
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Time slots for filtering
  const timeSlots = [
    { label: 'Sáng sớm (05:00 - 08:00)', value: 'early-morning', start: 5, end: 8 },
    { label: 'Buổi sáng (08:00 - 12:00)', value: 'morning', start: 8, end: 12 },
    { label: 'Buổi chiều (12:00 - 18:00)', value: 'afternoon', start: 12, end: 18 },
    { label: 'Buổi tối (18:00 - 22:00)', value: 'evening', start: 18, end: 22 },
    { label: 'Đêm (22:00 - 05:00)', value: 'night', start: 22, end: 29 }
  ];

  // Get price range from all trips
  const allPrices = trips.map(trip => trip.basePrice);
  const actualMaxPrice = Math.max(...allPrices);

  // Set default price range to 0 - 2 million
  const defaultMinPrice = 0;
  const defaultMaxPrice = 2000000;

  // Initialize price range with default values
  React.useEffect(() => {
    if (trips.length > 0 && priceRange.max === 0) {
      setPriceRange({ min: defaultMinPrice, max: defaultMaxPrice });
    }
  }, [trips, priceRange.max]);

  // Initial loading effect
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle price range change
  const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
    if (!isUserInteracted) {
      setIsUserInteracted(true);
    }

    if (type === 'min') {
      const newMin = Math.min(value, priceRange.max);
      setPriceRange({ ...priceRange, min: newMin });
    } else {
      const newMax = Math.max(value, priceRange.min);
      setPriceRange({ ...priceRange, max: newMax });
    }

    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };

  // Handle filter changes with loading
  const handleFilterChange = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };

  // Handle filters reset
  const handleFiltersReset = () => {
    setSelectedTimeSlots([]);
    setPriceRange({ min: defaultMinPrice, max: defaultMaxPrice });
    setIsUserInteracted(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };

  // Filter trips based on selected criteria
  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      // Time filter
      if (selectedTimeSlots.length > 0) {
        const departureHour = parseInt(trip.departureTime.split(':')[0]);
        const matchesTimeSlot = selectedTimeSlots.some(slot => {
          const timeSlot = timeSlots.find(ts => ts.value === slot);
          if (!timeSlot) return false;
          
          if (timeSlot.value === 'night') {
            return departureHour >= 22 || departureHour < 5;
          }
          return departureHour >= timeSlot.start && departureHour < timeSlot.end;
        });
        
        if (!matchesTimeSlot) return false;
      }

      // Price filter
      if (trip.basePrice < priceRange.min || trip.basePrice > priceRange.max) {
        return false;
      }

      return true;
    });
  }, [trips, selectedTimeSlots, priceRange, timeSlots]);

  // Group trips by route
  const groupedTrips = useMemo(() => {
    const groups: { [key: string]: Trip[] } = {};
    filteredTrips.forEach(trip => {
      const routeKey = `${trip.route?.name || 'Unknown Route'}-${trip.route?._id || 'unknown'}`;
      if (!groups[routeKey]) {
        groups[routeKey] = [];
      }
      groups[routeKey].push(trip);
    });
    
    // Sort trips within each group by departure time
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => {
        const timeA = a.departureTime.replace(':', '');
        const timeB = b.departureTime.replace(':', '');
        return timeA.localeCompare(timeB);
      });
    });
    
    return groups;
  }, [filteredTrips]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''}`;
  };

  const handleBooking = (trip: Trip) => {
    setSelectedTrip(trip);
    navigate(`/bookings/${trip._id}`, {
      state: {
        trip,
        searchParams
      }
    });
  };

  const getStationName = (station: any): string => {
    if (!station) return 'N/A';
    return station.name || 'N/A';
  };

  const getStationAddress = (station: any): string => {
    if (!station?.address) return 'N/A';
    const { street, ward, district, city } = station.address;
    return `${street}, ${ward}, ${district}, ${city}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      {/* Search Form Section */}
      <section className="bg-blue-700 py-8">
        <div className="container mx-auto px-4">
          <SearchForm className="mb-0" />
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <SearchResultsHeader 
          groupedTrips={groupedTrips}
          trips={trips}
          searchParams={searchParams}
        />

        {/* Main Content Layout */}
        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <SearchFilters
            selectedTimeSlots={selectedTimeSlots}
            setSelectedTimeSlots={setSelectedTimeSlots}
            priceRange={priceRange}
            onPriceRangeChange={handlePriceRangeChange}
            onFiltersReset={handleFiltersReset}
            onFilterChange={handleFilterChange}
            isUserInteracted={isUserInteracted}
            actualMaxPrice={actualMaxPrice}
            defaultMinPrice={defaultMinPrice}
            defaultMaxPrice={defaultMaxPrice}
          />

          {/* Right Content - Results */}
          <div className="flex-1">
            {isLoading ? (
              <LoadingSpinner />
            ) : Object.keys(groupedTrips).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(groupedTrips).map(([routeKey, routeTrips]) => {
                  const route = routeTrips[0].route;
                  return (
                    <motion.div
                      key={routeKey}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      {/* Route Header */}
                      <RouteHeader
                        route={route}
                        routeTrips={routeTrips}
                        formatPrice={formatPrice}
                        formatDuration={formatDuration}
                        getStationName={getStationName}
                        getStationAddress={getStationAddress}
                      />

                      {/* Trip List */}
                      <div className="divide-y divide-gray-100">
                        {routeTrips.map((trip, index) => (
                          <TripCard
                            key={trip._id}
                            trip={trip}
                            route={route}
                            index={index}
                            searchParams={searchParams}
                            formatPrice={formatPrice}
                            formatDuration={formatDuration}
                            getStationName={getStationName}
                            onBooking={handleBooking}
                          />
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <NoResults hasTrips={trips.length > 0} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;