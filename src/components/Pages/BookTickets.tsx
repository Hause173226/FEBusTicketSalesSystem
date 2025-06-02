import React, { useState } from 'react';
import { getSeats } from '../../utils/mockData';
import { CheckIcon, XIcon, AlertCircleIcon, CreditCardIcon, UserIcon, PhoneIcon, MailIcon } from 'lucide-react';
export const BookTickets = () => {
  const [selectedTrip, setSelectedTrip] = useState('trip-0-1-0');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingCompleted, setBookingCompleted] = useState(false);
  // Mock data for demonstration
  const busId = 'bus-1';
  const seats = getSeats(busId);
  const rows = Math.ceil(seats.length / 4);
  const toggleSeatSelection = (seatId: string, status: string) => {
    if (status === 'occupied') return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };
  const totalPrice = selectedSeats.reduce((total, seatId) => {
    const seat = seats.find(s => s.id === seatId);
    return total + (seat?.price || 0);
  }, 0);
  const handleBooking = () => {
    if (selectedSeats.length === 0) return;
    setShowBookingModal(true);
  };
  const completeBooking = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the form data to a backend
    setBookingCompleted(true);
    setTimeout(() => {
      setShowBookingModal(false);
      setSelectedSeats([]);
      setBookingCompleted(false);
    }, 3000);
  };
  return <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Select Your Seats
        </h1>
        <p className="text-white/70">
          Choose your preferred seats for the journey
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="mb-6 pb-6 border-b border-white/10">
              <div className="flex justify-center space-x-8">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded border border-white/30 bg-white/10 mr-2"></div>
                  <span className="text-white/70 text-sm">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded border border-purple-400 bg-purple-400/30 mr-2"></div>
                  <span className="text-white/70 text-sm">Selected</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded border border-white/30 bg-white/30 mr-2"></div>
                  <span className="text-white/70 text-sm">Occupied</span>
                </div>
              </div>
            </div>
            {/* Bus layout */}
            <div className="relative">
              {/* Bus front */}
              <div className="w-1/2 h-16 mx-auto mb-8 bg-white/10 rounded-t-3xl border-t border-l border-r border-white/20 flex items-center justify-center">
                <span className="text-white/70">Driver</span>
              </div>
              {/* Seat grid */}
              <div className="grid grid-cols-4 gap-3 px-4">
                {seats.map(seat => <div key={seat.id} className={`
                      h-12 rounded-t-lg border border-b-0 flex items-center justify-center cursor-pointer transition-all duration-200
                      ${seat.status === 'occupied' ? 'bg-white/30 border-white/30 cursor-not-allowed' : selectedSeats.includes(seat.id) ? 'bg-purple-400/30 border-purple-400 transform scale-105 shadow-lg' : 'bg-white/10 border-white/30 hover:bg-white/20'}
                    `} onClick={() => toggleSeatSelection(seat.id, seat.status)}>
                    <span className="text-white font-medium">{seat.id}</span>
                  </div>)}
              </div>
              {/* Aisle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-4"></div>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg sticky top-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              Booking Summary
            </h3>
            {selectedSeats.length > 0 ? <>
                <div className="mb-4 pb-4 border-b border-white/10">
                  <p className="text-white/70 mb-2">Selected Seats:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map(seatId => <div key={seatId} className="bg-purple-400/20 border border-purple-400/50 rounded px-2 py-1">
                        <span className="text-white text-sm">{seatId}</span>
                      </div>)}
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-white/70">Number of seats:</span>
                    <span className="text-white font-medium">
                      {selectedSeats.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Price per seat:</span>
                    <span className="text-white font-medium">
                      ${seats.find(s => s.id === selectedSeats[0])?.price}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-white/10">
                    <span className="text-white font-semibold">
                      Total price:
                    </span>
                    <span className="text-white font-bold">${totalPrice}</span>
                  </div>
                </div>
                <button onClick={handleBooking} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-center">
                  Proceed to Booking
                </button>
              </> : <div className="text-center py-8">
                <AlertCircleIcon className="h-12 w-12 text-white/40 mx-auto mb-3" />
                <p className="text-white/70">
                  Please select at least one seat to continue
                </p>
              </div>}
          </div>
        </div>
      </div>
      {/* Booking Modal */}
      {showBookingModal && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 rounded-xl border border-white/20 shadow-2xl w-full max-w-md p-6 animate-scaleIn">
            {bookingCompleted ? <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckIcon className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Booking Successful!
                </h3>
                <p className="text-white/70 mb-6">
                  Your tickets have been booked successfully.
                </p>
                <p className="text-white/70">Redirecting to your tickets...</p>
              </div> : <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">
                    Complete Your Booking
                  </h3>
                  <button onClick={() => setShowBookingModal(false)} className="text-white/70 hover:text-white">
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
                <form onSubmit={completeBooking}>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-white/80 text-sm mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <input type="text" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 pl-10" placeholder="John Doe" required />
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <input type="email" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 pl-10" placeholder="john.doe@example.com" required />
                        <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-1">
                        Phone
                      </label>
                      <div className="relative">
                        <input type="tel" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 pl-10" placeholder="+1 (123) 456-7890" required />
                        <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-1">
                        Payment Details
                      </label>
                      <div className="relative">
                        <input type="text" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 pl-10" placeholder="Card Number" required />
                        <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-4 mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-white/70">Total Amount:</span>
                      <span className="text-white font-bold">
                        ${totalPrice}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Seats:</span>
                      <span className="text-white">
                        {selectedSeats.join(', ')}
                      </span>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-center">
                    Confirm & Pay ${totalPrice}
                  </button>
                </form>
              </>}
          </div>
        </div>}
    </div>;
};