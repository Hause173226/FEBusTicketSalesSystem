import React, { useEffect, useState, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import { Seat } from '../types';
import { useAppContext } from '../context/AppContext';
import { seatsServices } from '../services/seatsServices';

type BusType = 'standard' | 'sleeper' | 'limousine' | 'vip';

const defaultSeatCounts: Record<BusType, number> = {
  standard: 40,
  sleeper: 32,
  limousine: 28,
  vip: 20,
};

// Different styles for different bus types
const seatStyles: Record<BusType, string> = {
  standard: 'w-12 h-12', // Increased from w-8 h-8
  sleeper: 'w-14 h-16', // Increased from w-10 h-14
  limousine: 'w-12 h-14', // Increased from w-8 h-10
  vip: 'w-14 h-14', // Increased from w-10 h-10
};

// Add seat layout configurations
type SeatLayout = {
  seatsPerRow: number;
  aisleAfterSeat?: number; // Add aisle after this seat number in each row
  hasDoubleDecker?: boolean; // For sleeper buses
  seatSpacing?: number; // Gap between seats
  rowSpacing?: number; // Gap between rows
};

const seatLayouts: Record<BusType, SeatLayout> = {
  standard: {
    seatsPerRow: 4,
    aisleAfterSeat: 2, // Aisle after 2nd seat
    seatSpacing: 4,
    rowSpacing: 4
  },
  sleeper: {
    seatsPerRow: 2,
    hasDoubleDecker: true,
    seatSpacing: 6,
    rowSpacing: 8
  },
  limousine: {
    seatsPerRow: 3,
    aisleAfterSeat: 2,
    seatSpacing: 6,
    rowSpacing: 6
  },
  vip: {
    seatsPerRow: 2,
    seatSpacing: 8,
    rowSpacing: 8
  }
};

interface SeatSelectionProps {
  tripId: string;
  basePrice: number;
  onSeatsChange?: (seats: Seat[]) => void;
  disabled?: boolean;
  busType?: BusType;
}

export interface SeatSelectionRef {
  getSelectedSeats: () => Seat[];
  confirmSeats: () => Promise<void>;
  refreshSeats: () => Promise<void>;
}

const SeatSelection = React.forwardRef<SeatSelectionRef, SeatSelectionProps>(
  ({ tripId, basePrice, onSeatsChange, disabled = false, busType = 'standard' }, ref) => {
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
      
      const currentBusType = (busType?.toLowerCase() || 'standard') as BusType;
      const seatStyle = seatStyles[currentBusType];
      
      return (
        <motion.button
          key={seat.id}
          className={`
            ${seatStyle} m-1 rounded-md border-2 flex items-center justify-center font-semibold transition-all
            ${currentBusType === 'sleeper' ? 'flex-col' : ''}
            ${seat.isAvailable ? 'cursor-pointer hover:shadow-md transform hover:-translate-y-0.5' : 'cursor-not-allowed opacity-50 bg-gray-100 border-gray-300'}
            ${isConfirmedSelected ? 'bg-green-500 border-green-600 text-white' : 
              isTemporarySelected ? 'bg-blue-100 border-blue-500 text-blue-800' : 
              seat.isAvailable ? 'bg-white border-gray-300 text-gray-800 hover:border-blue-400 hover:text-blue-600' : ''}
          `}
          whileHover={{ scale: seat.isAvailable ? 1.05 : 1 }}
          whileTap={{ scale: seat.isAvailable ? 0.95 : 1 }}
          onClick={() => handleSeatClick(seat)}
          disabled={!seat.isAvailable || isConfirmedSelected}
        >
          {currentBusType === 'sleeper' ? (
            <>
              <span className="text-xs mb-1">Giường</span>
              <span className="text-base font-bold">{seat.number}</span>
            </>
          ) : (
            <span className="text-base font-bold">{seat.number}</span>
          )}
        </motion.button>
      );
    };

    const renderDeck = (seats: Seat[], layout: SeatLayout) => {
      const rows = [];
      const seatsPerRow = 2; // Fixed 2 seats per row for each column
      
      for (let i = 0; i < seats.length; i += seatsPerRow) {
        const rowSeats = seats.slice(i, i + seatsPerRow);
        rows.push(
          <div key={`row-${i}`} className="flex justify-center gap-6">
            {rowSeats.map((seat) => (
              <React.Fragment key={seat.id}>
                {renderSeat(seat)}
              </React.Fragment>
            ))}
          </div>
        );
      }
      return rows;
    };

    const renderSeatLayout = () => {
      const currentBusType = (busType?.toLowerCase() || 'standard') as BusType;
      const layout = seatLayouts[currentBusType];
      const maxSeats = defaultSeatCounts[currentBusType];
      const allSeats = availableSeats.slice(0, maxSeats);
      
      // Split seats into A and B sections
      const aSeats = allSeats.filter(seat => seat.number.startsWith('A'));
      const bSeats = allSeats.filter(seat => seat.number.startsWith('B'));
      
      return (
        <div className="flex gap-8 justify-center items-start">
          <div className="space-y-3">
            {renderDeck(aSeats, layout)}
          </div>
          <div className="space-y-3">
            {renderDeck(bSeats, layout)}
          </div>
        </div>
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

    return (
      <div className={`space-y-4 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
        {showConfirmationMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-green-700">
              Đã xác nhận {confirmedSeatCount} ghế thành công!
            </p>
          </div>
        )}

        {/* Seat types legend */}
        <div className="flex items-center justify-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500 border border-green-600 rounded"></div>
            <span className="text-sm text-gray-600">Đã xác nhận</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-100 border border-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Đang chọn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 border border-gray-400 rounded opacity-30"></div>
            <span className="text-sm text-gray-600">Đã đặt</span>
          </div>
        </div>

        <div className="bg-white rounded border border-gray-200">
          <div className="p-6">
            {renderSeatLayout()}
          </div>
        </div>
      </div>
    );
  }
);

SeatSelection.displayName = 'SeatSelection';

export default SeatSelection;