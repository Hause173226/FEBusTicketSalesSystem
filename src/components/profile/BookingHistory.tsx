import React from 'react';
import { Ticket } from 'lucide-react';
import { Booking } from '../../types';
import TicketCard from '../TicketCard';

interface BookingHistoryProps {
  isLoading: boolean;
  bookings: Booking[];
}

const BookingHistory: React.FC<BookingHistoryProps> = ({
  isLoading,
  bookings
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Vé đã đặt</h2>
      </div>
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải danh sách vé...</p>
          </div>
        ) : bookings && bookings.length > 0 ? (
          bookings.map((booking) => (
            <TicketCard key={booking._id} booking={booking} />
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Bạn chưa có vé nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
