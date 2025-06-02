import React, { useEffect, useState } from 'react';
import { statistics } from '../../utils/mockData';
import { BarChart3Icon, TrendingUpIcon, UsersIcon, BusIcon, MapIcon, CalendarIcon, ClockIcon, DollarSignIcon, StarIcon, ActivityIcon } from 'lucide-react';
export const Dashboard = () => {
  const [animatedStats, setAnimatedStats] = useState({
    totalRoutes: 0,
    totalBuses: 0,
    totalTrips: 0,
    activeTrips: 0,
    totalPassengers: 0,
    monthlyRevenue: 0,
    customerSatisfaction: 0,
    totalCities: 0,
    onTimePerformance: 0
  });
  useEffect(() => {
    const animationDuration = 2000; // 2 seconds
    const frameDuration = 16; // ~60fps
    const totalFrames = Math.round(animationDuration / frameDuration);
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      setAnimatedStats({
        totalRoutes: Math.floor(progress * statistics.totalRoutes),
        totalBuses: Math.floor(progress * statistics.totalBuses),
        totalTrips: Math.floor(progress * statistics.totalTrips),
        activeTrips: Math.floor(progress * statistics.activeTrips),
        totalPassengers: Math.floor(progress * statistics.totalPassengers),
        monthlyRevenue: Math.floor(progress * statistics.monthlyRevenue),
        customerSatisfaction: Number((progress * statistics.customerSatisfaction).toFixed(1)),
        totalCities: Math.floor(progress * statistics.totalCities),
        onTimePerformance: Math.floor(progress * statistics.onTimePerformance)
      });
      if (frame === totalFrames) {
        clearInterval(timer);
        setAnimatedStats(statistics);
      }
    }, frameDuration);
    return () => clearInterval(timer);
  }, []);
  const StatCard = ({
    title,
    value,
    icon,
    suffix = '',
    prefix = ''
  }) => <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/15">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/70 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">
            {prefix}
            {value.toLocaleString()}
            {suffix}
          </h3>
        </div>
        <div className="bg-white/10 p-3 rounded-lg">{icon}</div>
      </div>
    </div>;
  return <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Management Dashboard
        </h1>
        <p className="text-white/70">
          Overview of system performance and statistics
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Routes" value={animatedStats.totalRoutes} icon={<MapIcon className="h-6 w-6 text-blue-400" />} />
        <StatCard title="Total Buses" value={animatedStats.totalBuses} icon={<BusIcon className="h-6 w-6 text-purple-400" />} />
        <StatCard title="Total Trips" value={animatedStats.totalTrips} icon={<CalendarIcon className="h-6 w-6 text-pink-400" />} />
        <StatCard title="Active Trips" value={animatedStats.activeTrips} icon={<ActivityIcon className="h-6 w-6 text-green-400" />} />
        <StatCard title="Total Passengers" value={animatedStats.totalPassengers} icon={<UsersIcon className="h-6 w-6 text-yellow-400" />} />
        <StatCard title="Monthly Revenue" value={animatedStats.monthlyRevenue} icon={<DollarSignIcon className="h-6 w-6 text-emerald-400" />} prefix="$" />
        <StatCard title="Customer Satisfaction" value={animatedStats.customerSatisfaction} icon={<StarIcon className="h-6 w-6 text-amber-400" />} suffix="/5" />
        <StatCard title="Total Cities" value={animatedStats.totalCities} icon={<MapIcon className="h-6 w-6 text-indigo-400" />} />
        <StatCard title="On-Time Performance" value={animatedStats.onTimePerformance} icon={<ClockIcon className="h-6 w-6 text-cyan-400" />} suffix="%" />
      </div>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">
              Monthly Revenue
            </h3>
            <div className="bg-white/10 p-2 rounded-lg">
              <BarChart3Icon className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          <div className="h-64 flex items-end space-x-2">
            {[65, 45, 75, 55, 80, 65, 90, 85, 50, 70, 75, 95].map((height, i) => <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-sm animate-growUp" style={{
              height: `${height}%`,
              animationDelay: `${i * 100}ms`
            }}></div>
                  <div className="text-white/60 text-xs mt-2">
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                  </div>
                </div>)}
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">
              Passenger Growth
            </h3>
            <div className="bg-white/10 p-2 rounded-lg">
              <TrendingUpIcon className="h-5 w-5 text-green-400" />
            </div>
          </div>
          <div className="h-64 relative">
            {/* Line chart */}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,50 Q10,45 20,48 T40,40 T60,30 T80,20 T100,10" fill="none" stroke="url(#gradient)" strokeWidth="2" className="animate-drawLine" />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </svg>
            {/* Data points */}
            {[50, 45, 48, 40, 30, 20, 10].map((point, i) => {
            const x = i * 16.6;
            return <div key={i} className="absolute w-3 h-3 bg-white rounded-full border-2 border-purple-500 animate-pulse" style={{
              left: `${x}%`,
              top: `${point}%`,
              animationDelay: `${i * 200}ms`
            }}></div>;
          })}
            {/* Y-axis labels */}
            <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-white/60 text-xs">
              <span>100k</span>
              <span>75k</span>
              <span>50k</span>
              <span>25k</span>
              <span>0</span>
            </div>
            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 w-full flex justify-between text-white/60 text-xs">
              <span>Jan</span>
              <span>Mar</span>
              <span>May</span>
              <span>Jul</span>
              <span>Sep</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>
        </div>
      </div>
    </div>;
};