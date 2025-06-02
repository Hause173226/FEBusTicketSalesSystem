import React from 'react';
export const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte'];
export const busTypes = ['Standard', 'Express', 'VIP', 'Sleeper', 'Double-Decker'];
export const routes = cities.flatMap((departureCity, i) => cities.filter((_, j) => i !== j).map(arrivalCity => ({
  id: `${i}-${cities.indexOf(arrivalCity)}`,
  departureCity,
  arrivalCity,
  distance: Math.floor(Math.random() * 900) + 100,
  duration: Math.floor(Math.random() * 10) + 2,
  price: Math.floor(Math.random() * 100) + 30
})));
export const buses = Array(20).fill(null).map((_, i) => ({
  id: `bus-${i + 1}`,
  type: busTypes[Math.floor(Math.random() * busTypes.length)],
  capacity: [40, 45, 50, 55, 60][Math.floor(Math.random() * 5)],
  licensePlate: `BUS-${1000 + i}`
}));
export const trips = routes.flatMap(route => Array(3).fill(null).map((_, i) => ({
  id: `trip-${route.id}-${i}`,
  routeId: route.id,
  busId: buses[Math.floor(Math.random() * buses.length)].id,
  departureTime: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
  arrivalTime: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
  date: new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  availableSeats: Math.floor(Math.random() * 30) + 10
})));
export const getRoute = (routeId: string) => routes.find(route => route.id === routeId);
export const getTrip = (tripId: string) => trips.find(trip => trip.id === tripId);
export const getBus = (busId: string) => buses.find(bus => bus.id === busId);
export const getSeats = (busId: string) => {
  const bus = getBus(busId);
  if (!bus) return [];
  const totalSeats = bus.capacity;
  const seatsPerRow = bus.type === 'Double-Decker' ? 4 : 4;
  const rows = Math.ceil(totalSeats / seatsPerRow);
  return Array(totalSeats).fill(null).map((_, i) => {
    const row = Math.floor(i / seatsPerRow) + 1;
    const position = i % seatsPerRow;
    const seatLetter = ['A', 'B', 'C', 'D'][position];
    return {
      id: `${row}${seatLetter}`,
      row,
      position: seatLetter,
      status: Math.random() > 0.7 ? 'occupied' : 'available',
      price: bus.type === 'VIP' ? 45 : bus.type === 'Sleeper' ? 60 : 30
    };
  });
};
export const statistics = {
  totalRoutes: routes.length,
  totalBuses: buses.length,
  totalTrips: trips.length,
  activeTrips: Math.floor(trips.length * 0.8),
  totalPassengers: 245789,
  monthlyRevenue: 1876500,
  customerSatisfaction: 4.7,
  totalCities: cities.length,
  onTimePerformance: 92
};