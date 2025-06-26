import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Seat } from '../types';
import { useAppContext } from '../context/AppContext';
import { seatsServices } from '../services/seatsServices';

interface SeatSelectionProps {
  tripId: string;
  basePrice: number;
  onConfirmSeats?: (seats: Seat[]) => void;
  disabled?: boolean;
}

const TEMP_BOOKING_KEY = 'temp_booking_data';

const SeatSelection: React.FC<SeatSelectionProps> = ({ tripId, basePrice, onConfirmSeats, disabled = false }) => {
  const { selectedSeats } = useAppContext();
  const [availableSeats, setAvailableSeats] = useState<Seat[]>([]);
  const [temporarySelectedSeats, setTemporarySelectedSeats] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  const [confirmedSeatCount, setConfirmedSeatCount] = useState(0);

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
      
      {/* Selected seats summary */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-medium text-gray-700 mb-2">Ghế đang chọn</h4>
        
        {temporarySelectedSeats.length > 0 ? (
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {temporarySelectedSeats.map((seat) => (
                <div key={seat.id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {seat.number}
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Tổng tiền:</span>
              <span className="text-lg font-semibold text-blue-700">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(temporarySelectedSeats.length * basePrice)}
              </span>
            </div>

            <button
              onClick={async () => {
                if (onConfirmSeats) {
                  setIsConfirming(true);
                  try {
                    await seatsServices.selectSeat({
                      tripId,
                      seatNumbers: temporarySelectedSeats.map(seat => seat.number)
                    });
                    onConfirmSeats(temporarySelectedSeats);
                    
                    // Store trip and seat information in localStorage
                    const tempBookingData = {
                      tripId,
                      seats: temporarySelectedSeats,
                      timestamp: new Date().toISOString()
                    };
                    localStorage.setItem(TEMP_BOOKING_KEY, JSON.stringify(tempBookingData));
                    
                    // Store the count before clearing
                    const count = temporarySelectedSeats.length;
                    // Clear temporary selections after confirmation
                    setTemporarySelectedSeats([]);
                    // Show confirmation message with correct count
                    setConfirmedSeatCount(count);
                    setShowConfirmationMessage(true);
                  } catch (err: any) {
                    console.error('Failed to confirm seats:', err);
                    if (err.response?.status === 400 && err.response?.data?.message?.includes('seat')) {
                      alert('Một số ghế đã được người khác chọn. Vui lòng chọn ghế khác.');
                      // Refresh available seats
                      const updatedSeats = await seatsServices.getAvailableSeats(tripId);
                      setAvailableSeats(updatedSeats.map(seat => ({
                        id: seat.seatId,
                        number: seat.seatNumber,
                        isAvailable: seat.isAvailable,
                        price: basePrice,
                        type: 'standard',
                        tripId: tripId
                      })));
                    } else {
                      alert('Không thể xác nhận ghế. Vui lòng thử lại.');
                    }
                  } finally {
                    setIsConfirming(false);
                  }
                }
              }}
              disabled={isConfirming || temporarySelectedSeats.length === 0}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isConfirming ? 'Đang xác nhận...' : 'Xác nhận chọn ghế'}
            </button>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Vui lòng chọn ít nhất một ghế</p>
        )}
      </div>
    </div>
  );
};

export default SeatSelection;