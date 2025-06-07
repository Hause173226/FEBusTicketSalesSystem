import React from 'react';
import { motion } from 'framer-motion';
import { BusLayout, Seat } from '../types';
import { useAppContext } from '../context/AppContext';

interface SeatSelectionProps {
  busLayout: BusLayout;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({ busLayout }) => {
  const { selectedSeats, toggleSeatSelection } = useAppContext();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const renderSeat = (seat: Seat, index: number) => {
    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    
    let seatTypeClass = '';
    if (seat.type === 'vip') {
      seatTypeClass = 'bg-purple-100 border-purple-300 text-purple-800';
    } else if (seat.type === 'premium') {
      seatTypeClass = 'bg-blue-100 border-blue-300 text-blue-800';
    } else {
      seatTypeClass = 'bg-gray-100 border-gray-300 text-gray-800';
    }

    return (
      <motion.button
        key={seat.id}
        className={`
          w-12 h-12 m-1 rounded-md border-2 flex items-center justify-center text-sm font-medium transition-all
          ${seat.isAvailable ? 'cursor-pointer hover:shadow-md' : 'cursor-not-allowed opacity-30 bg-gray-200 border-gray-400'}
          ${isSelected ? 'bg-green-200 border-green-500 text-green-800' : seat.isAvailable ? seatTypeClass : ''}
        `}
        whileHover={{ scale: seat.isAvailable ? 1.05 : 1 }}
        whileTap={{ scale: seat.isAvailable ? 0.95 : 1 }}
        onClick={() => seat.isAvailable && toggleSeatSelection(seat)}
        disabled={!seat.isAvailable}
      >
        {seat.number}
      </motion.button>
    );
  };

  const renderBusLayout = () => {
    const { rows, columns, seats, aisleAfterColumn } = busLayout;
    const seatRows = [];

    for (let i = 0; i < rows; i++) {
      const rowSeats = [];
      for (let j = 0; j < columns; j++) {
        const seatIndex = i * columns + j;
        if (seatIndex < seats.length) {
          rowSeats.push(renderSeat(seats[seatIndex], seatIndex));
        }
        
        // Add aisle after specific column if needed
        if (aisleAfterColumn && j === aisleAfterColumn - 1) {
          rowSeats.push(<div key={`aisle-${i}`} className="w-6"></div>);
        }
      }
      seatRows.push(
        <div key={`row-${i}`} className="flex justify-center">
          {rowSeats}
        </div>
      );
    }

    return seatRows;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Chọn ghế</h3>
      
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
            {renderBusLayout()}
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
          <div className="w-6 h-6 bg-purple-100 border-2 border-purple-300 rounded-md mr-2"></div>
          <span className="text-sm text-gray-600">VIP</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-100 border-2 border-blue-300 rounded-md mr-2"></div>
          <span className="text-sm text-gray-600">Cao cấp</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-100 border-2 border-gray-300 rounded-md mr-2"></div>
          <span className="text-sm text-gray-600">Thường</span>
        </div>
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
                {formatPrice(selectedSeats.reduce((sum, seat) => sum + seat.price, 0))}
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