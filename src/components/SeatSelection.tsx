import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Seat } from '../types';
import { useAppContext } from '../context/AppContext';
import { seatsServices } from '../services/seatsServices';

interface SeatSelectionProps {
  tripId: string;
  basePrice: number;
}

interface SeatType {
  seatBookingId: string;
  seatId: string;
  seatNumber: string;
  status: string;
  isAvailable: boolean;
  isSelected: boolean;
  isBooked: boolean;
  lockedUntil: string;
  bookedBy: string;
  bookingCode: string;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({ tripId, basePrice }) => {
  const { selectedSeats, toggleSeatSelection } = useAppContext();
  const [availableSeats, setAvailableSeats] = useState<SeatType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableSeats = async () => {
      try {
        const response = await seatsServices.getAvailableSeats(tripId);
        
        if (Array.isArray(response)) {
          setAvailableSeats(response);
        } else {
          setError('Định dạng dữ liệu ghế không hợp lệ');
        }
      } catch (err) {
        setError('Không thể tải thông tin ghế. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    if (tripId) {
      fetchAvailableSeats();
    }
  }, [tripId]);

  const handleSeatClick = async (seat: SeatType) => {
    if (!seat.isAvailable || seat.isBooked) return;

    try {
      const seatToToggle: Seat = {
        id: seat.seatId,
        number: seat.seatNumber,
        isAvailable: seat.isAvailable,
        price: basePrice,
        type: 'standard'
      };

      if (selectedSeats.some(s => s.id === seat.seatId)) {
        // Release seat
        await seatsServices.releaseSeat({
          tripId,
          seatNumber: seat.seatNumber
        });
        toggleSeatSelection(seatToToggle);
      } else {
        // Check if user has already selected 5 seats
        if (selectedSeats.length >= 5) {
          alert('Bạn chỉ được chọn tối đa 5 ghế');
          return;
        }

        // Select seat
        try {
          const response = await seatsServices.selectSeat({
            tripId,
            seatNumber: seat.seatNumber
          });
          
          if (response) {
            toggleSeatSelection(seatToToggle);
            // Update the seat in availableSeats
            setAvailableSeats(prevSeats => 
              prevSeats.map(s => 
                s.seatId === seat.seatId 
                  ? { ...s, isSelected: true }
                  : s
              )
            );
          }
        } catch (error) {
          console.error('Failed to select seat:', error);
          alert('Ghế này đã được người khác chọn. Vui lòng chọn ghế khác.');
          // Refresh the seat list to get updated status
          const updatedSeats = await seatsServices.getAvailableSeats(tripId);
          setAvailableSeats(updatedSeats);
        }
      }
    } catch (err) {
      console.error('Failed to handle seat selection:', err);
      alert('Không thể chọn ghế. Vui lòng thử lại sau.');
    }
  };

  const renderSeat = (seat: SeatType) => {
    const isSelected = selectedSeats.some((s) => s.id === seat.seatId);
    
    return (
      <motion.button
        key={seat.seatId}
        className={`
          w-12 h-12 m-1 rounded-md border-2 flex items-center justify-center text-sm font-medium transition-all
          ${seat.isAvailable ? 'cursor-pointer hover:shadow-md' : 'cursor-not-allowed opacity-30 bg-gray-200 border-gray-400'}
          ${isSelected ? 'bg-green-200 border-green-500 text-green-800' : seat.isAvailable ? 'bg-gray-100 border-gray-300 text-gray-800' : ''}
        `}
        whileHover={{ scale: seat.isAvailable ? 1.05 : 1 }}
        whileTap={{ scale: seat.isAvailable ? 0.95 : 1 }}
        onClick={() => handleSeatClick(seat)}
        disabled={!seat.isAvailable || seat.isBooked}
      >
        {seat.seatNumber}
      </motion.button>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Đang tải thông tin ghế...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <p>{error}</p>
      </div>
    );
  }

  // Organize seats into rows (assuming 4 seats per row)
  const renderSeatLayout = () => {
    const seatsPerRow = 4;
    const rows = [];
    for (let i = 0; i < availableSeats.length; i += seatsPerRow) {
      const rowSeats = availableSeats.slice(i, i + seatsPerRow);
      rows.push(
        <div key={`row-${i}`} className="flex justify-center">
          {rowSeats.map((seat) => renderSeat(seat))}
        </div>
      );
    }
    return rows;
  };

  return (
    <div>
      <div className="flex justify-center mb-6">
        <div className="flex flex-col">
          {/* Bus front */}
          <div className="text-center mb-2">
            <div className="inline-block px-8 py-2 bg-gray-200 rounded-t-lg text-sm font-medium">
              Phía trước
            </div>
          </div>
          
          {/* Seat layout */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            {renderSeatLayout()}
          </div>
          
          {/* Bus back */}
          <div className="text-center mt-2">
            <div className="inline-block px-8 py-2 bg-gray-200 rounded-b-lg text-sm font-medium">
              Phía sau
            </div>
          </div>
        </div>
      </div>
      
      {/* Seat types legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-green-200 border-2 border-green-500 rounded-md mr-2"></div>
          <span className="text-sm text-gray-600">Đã chọn</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-200 border-2 border-gray-400 rounded-md mr-2 opacity-30"></div>
          <span className="text-sm text-gray-600">Đã đặt</span>
        </div>
      </div>
      
      {/* Selected seats summary */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-medium text-gray-700 mb-2">Ghế đã chọn</h4>
        
        {selectedSeats.length > 0 ? (
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedSeats.map((seat) => (
                <div key={seat.id} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {seat.number}
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tổng tiền:</span>
              <span className="text-lg font-semibold text-blue-700">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(selectedSeats.length * basePrice)}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Vui lòng chọn ít nhất một ghế</p>
        )}
      </div>
    </div>
  );
};

export default SeatSelection;