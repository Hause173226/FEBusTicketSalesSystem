import React, { useEffect, useState, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import { Seat } from '../types';
import { useAppContext } from '../context/AppContext';
import { seatsServices } from '../services/seatsServices';

interface SeatSelectionProps {
  tripId: string;
  basePrice: number;
  onSeatsChange?: (seats: Seat[]) => void;
  disabled?: boolean;
}

export interface SeatSelectionRef {
  getSelectedSeats: () => Seat[];
  confirmSeats: () => Promise<void>;
  refreshSeats: () => Promise<void>;
}

const SeatSelection = React.forwardRef<SeatSelectionRef, SeatSelectionProps>(
  ({ tripId, basePrice, onSeatsChange, disabled = false }, ref) => {
  const { selectedSeats } = useAppContext();
  const [availableSeats, setAvailableSeats] = useState<Seat[]>([]);
  const [temporarySelectedSeats, setTemporarySelectedSeats] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  const [confirmedSeatCount, setConfirmedSeatCount] = useState(0);

  useImperativeHandle(ref, () => ({
    getSelectedSeats: () => temporarySelectedSeats,
    confirmSeats: async () => {
      if (temporarySelectedSeats.length > 0) {
        await seatsServices.selectSeat({
          tripId,
          seatNumbers: temporarySelectedSeats.map(seat => seat.number)
        });
        setConfirmedSeatCount(temporarySelectedSeats.length);
        setShowConfirmationMessage(true);
        setTemporarySelectedSeats([]);
      }
    },
    refreshSeats: async () => {
      setIsLoading(true);
      try {
        const response = await seatsServices.getAvailableSeats(tripId);
        setAvailableSeats(response.map(seat => ({
          id: seat.seatId,
          number: seat.seatNumber,
          isAvailable: seat.isAvailable,
          price: basePrice,
          type: 'standard',
          tripId: tripId
        })));
        setTemporarySelectedSeats([]); // Clear selected seats
      } catch (err) {
        setError('Không thể tải lại thông tin ghế.');
      } finally {
        setIsLoading(false);
      }
    }
  }));

  useEffect(() => {
    const fetchAvailableSeats = async () => {
      try {
        const response = await seatsServices.getAvailableSeats(tripId);
        
        if (Array.isArray(response)) {
          setAvailableSeats(response.map(seat => ({
            id: seat.seatId,
            number: seat.seatNumber,
            isAvailable: seat.isAvailable,
            price: basePrice,
            type: 'standard',
            tripId: tripId
          })));
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

  // Reset confirmation message when selecting new seats
  useEffect(() => {
    if (temporarySelectedSeats.length > 0) {
      setShowConfirmationMessage(false);
    }
  }, [temporarySelectedSeats]);

  // Notify parent component when selected seats change
  useEffect(() => {
    if (onSeatsChange) {
      onSeatsChange(temporarySelectedSeats);
    }
  }, [temporarySelectedSeats, onSeatsChange]);

  const handleSeatClick = (seat: Seat) => {
    if (!seat.isAvailable) return;

    const seatToToggle: Seat = {
      id: seat.id,
      number: seat.number,
      isAvailable: seat.isAvailable,
      price: basePrice,
      type: 'standard',
      tripId: tripId
    };

    // Check if seat is already in temporary selection
    const isTemporarySelected = temporarySelectedSeats.some(s => s.id === seat.id);

    if (isTemporarySelected) {
      // Remove from temporary selection
      setTemporarySelectedSeats(temporarySelectedSeats.filter(s => s.id !== seat.id));
    } else {
      // Check if user has already selected 5 seats
      if (temporarySelectedSeats.length >= 5) {
        alert('Bạn chỉ được chọn tối đa 5 ghế');
        return;
      }

      // Add to temporary selection
      setTemporarySelectedSeats([...temporarySelectedSeats, seatToToggle]);
    }
  };

  const renderSeat = (seat: Seat) => {
    const isTemporarySelected = temporarySelectedSeats.some((s) => s.id === seat.id);
    const isConfirmedSelected = selectedSeats.some((s) => s.id === seat.id);
    
    return (
      <motion.button
        key={seat.id}
        className={`
          w-12 h-12 m-1 rounded-md border-2 flex items-center justify-center text-sm font-medium transition-all
          ${seat.isAvailable ? 'cursor-pointer hover:shadow-md' : 'cursor-not-allowed opacity-30 bg-gray-200 border-gray-400'}
          ${isConfirmedSelected ? 'bg-green-500 border-green-600 text-white' : 
            isTemporarySelected ? 'bg-blue-200 border-blue-500 text-blue-800' : 
            seat.isAvailable ? 'bg-gray-100 border-gray-300 text-gray-800' : ''}
        `}
        whileHover={{ scale: seat.isAvailable ? 1.05 : 1 }}
        whileTap={{ scale: seat.isAvailable ? 0.95 : 1 }}
        onClick={() => handleSeatClick(seat)}
        disabled={!seat.isAvailable || isConfirmedSelected}
      >
        {seat.number}
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
    <div className={`space-y-6 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {showConfirmationMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-medium">
            Đã xác nhận {confirmedSeatCount} ghế thành công!
          </p>
        </div>
      )}

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
          <div className="w-6 h-6 bg-green-500 border-2 border-green-600 rounded-md mr-2"></div>
          <span className="text-sm text-gray-600">Đã xác nhận</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-200 border-2 border-blue-500 rounded-md mr-2"></div>
          <span className="text-sm text-gray-600">Đang chọn</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-200 border-2 border-gray-400 rounded-md mr-2 opacity-30"></div>
          <span className="text-sm text-gray-600">Đã đặt</span>
        </div>
      </div>
      

    </div>
  );
});

SeatSelection.displayName = 'SeatSelection';

export default SeatSelection;