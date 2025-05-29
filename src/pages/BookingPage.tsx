import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, MapPin, Calendar, Users } from 'lucide-react';
import { routes, formatPrice } from '../utils/data';
import SeatSelection from '../components/SeatSelection';
const BookingPage = () => {
  const {
    routeId
  } = useParams();
  const navigate = useNavigate();
  const [route, setRoute] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [step, setStep] = useState(1);
  useEffect(() => {
    // Find the route based on routeId
    const foundRoute = routes.find(r => r.id === parseInt(routeId));
    if (foundRoute) {
      setRoute(foundRoute);
      setSelectedTime(foundRoute.departureTime[0]);
    }
  }, [routeId]);
  const handleDateChange = e => {
    setSelectedDate(e.target.value);
  };
  const handleTimeChange = e => {
    setSelectedTime(e.target.value);
  };
  const handleContinue = () => {
    setStep(2);
  };
  const handleSeatSelect = selectedSeats => {
    // In a real application, we would store the booking information
    // For now, just navigate to checkout
    navigate('/checkout');
  };
  if (!route) {
    return <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Đang tải thông tin...</p>
        </div>
      </div>;
  }
  return <div className="container mx-auto px-4 py-8">
      {/* Booking Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'} flex items-center justify-center font-medium`}>
              1
            </div>
            <span className="text-sm mt-1">Chọn chuyến</span>
          </div>
          <div className="w-16 h-1 bg-gray-200 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'} flex items-center justify-center font-medium`}>
              2
            </div>
            <span className="text-sm mt-1">Chọn ghế</span>
          </div>
          <div className="w-16 h-1 bg-gray-200 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'} flex items-center justify-center font-medium`}>
              3
            </div>
            <span className="text-sm mt-1">Thanh toán</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                {route.from}
                <ArrowRight size={20} className="mx-3 text-gray-400" />
                {route.to}
              </h2>
              <p className="text-gray-600">
                {route.busCompany} • {route.busType}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(route.price)}
              </span>
              <span className="text-gray-500 text-sm">/người</span>
            </div>
          </div>
        </div>
        {step === 1 ? <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Thông tin chuyến xe
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Clock size={20} className="mr-3 text-gray-500 mt-1" />
                    <div>
                      <p className="font-medium">Thời gian di chuyển</p>
                      <p className="text-gray-600">{route.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin size={20} className="mr-3 text-gray-500 mt-1" />
                    <div>
                      <p className="font-medium">Điểm đón</p>
                      <p className="text-gray-600">Bến xe {route.from}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin size={20} className="mr-3 text-gray-500 mt-1" />
                    <div>
                      <p className="font-medium">Điểm trả</p>
                      <p className="text-gray-600">Bến xe {route.to}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Chọn ngày và giờ</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày khởi hành
                    </label>
                    <div className="relative">
                      <input type="date" id="date" value={selectedDate} onChange={handleDateChange} min={new Date().toISOString().split('T')[0]} className="block w-full rounded-md border-gray-300 py-2 px-4 border focus:border-blue-500 focus:ring-blue-500" required />
                      <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                      Giờ khởi hành
                    </label>
                    <select id="time" value={selectedTime} onChange={handleTimeChange} className="block w-full rounded-md border-gray-300 py-2 px-4 border focus:border-blue-500 focus:ring-blue-500" required>
                      {route.departureTime.map(time => <option key={time} value={time}>
                          {time}
                        </option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
                      Số lượng hành khách
                    </label>
                    <div className="relative">
                      <select id="passengers" className="block w-full rounded-md border-gray-300 py-2 px-4 border focus:border-blue-500 focus:ring-blue-500" defaultValue="1">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => <option key={num} value={num}>
                            {num} hành khách
                          </option>)}
                      </select>
                      <Users size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button onClick={() => navigate('/')} className="flex items-center text-blue-600 hover:text-blue-800">
                <ArrowLeft size={18} className="mr-1" />
                Quay lại
              </button>
              <button onClick={handleContinue} disabled={!selectedDate} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                Tiếp tục
              </button>
            </div>
          </div> : <div className="p-6">
            <SeatSelection onSeatSelect={handleSeatSelect} />
            <div className="mt-6">
              <button onClick={() => setStep(1)} className="flex items-center text-blue-600 hover:text-blue-800">
                <ArrowLeft size={18} className="mr-1" />
                Quay lại
              </button>
            </div>
          </div>}
      </div>
    </div>;
};
export default BookingPage;