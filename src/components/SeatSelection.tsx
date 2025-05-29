import React, { useState } from 'react';
import { busLayout } from '../utils/data';
const SeatSelection = ({
  onSeatSelect
}) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const handleSeatClick = seatNumber => {
    if (busLayout.unavailableSeats.includes(seatNumber)) {
      return; // Seat is unavailable
    }
    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(seat => seat !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };
  const renderSeats = () => {
    const seats = [];
    let seatNumber = 1;
    for (let row = 1; row <= busLayout.rows; row++) {
      const rowSeats = [];
      for (let col = 1; col <= busLayout.columns; col++) {
        // Check if we need to add an aisle
        if (busLayout.aisle.includes(col)) {
          rowSeats.push(<div key={`aisle-${row}-${col}`} className="w-6"></div>);
        }
        const isUnavailable = busLayout.unavailableSeats.includes(seatNumber);
        const isSelected = selectedSeats.includes(seatNumber);
        rowSeats.push(<button key={seatNumber} className={`w-12 h-12 m-1 rounded-md flex items-center justify-center text-sm font-medium transition-colors ${isUnavailable ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : isSelected ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 hover:border-blue-500 text-gray-700'}`} onClick={() => handleSeatClick(seatNumber)} disabled={isUnavailable}>
            {seatNumber}
          </button>);
        seatNumber++;
      }
      seats.push(<div key={`row-${row}`} className="flex justify-center my-1">
          {rowSeats}
        </div>);
    }
    return seats;
  };
  return <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Chọn ghế</h3>
      <div className="flex justify-center mb-6">
        <div className="flex items-center mx-2">
          <div className="w-4 h-4 bg-white border border-gray-300 rounded-sm mr-2"></div>
          <span className="text-sm">Ghế trống</span>
        </div>
        <div className="flex items-center mx-2">
          <div className="w-4 h-4 bg-blue-600 rounded-sm mr-2"></div>
          <span className="text-sm">Ghế đã chọn</span>
        </div>
        <div className="flex items-center mx-2">
          <div className="w-4 h-4 bg-gray-200 rounded-sm mr-2"></div>
          <span className="text-sm">Ghế đã đặt</span>
        </div>
      </div>
      <div className="mb-4">
        <div className="w-full bg-gray-200 p-2 rounded-t-lg text-center font-medium">
          Cabin lái xe
        </div>
        {renderSeats()}
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">
              Ghế đã chọn: {selectedSeats.join(', ')}
            </p>
            <p className="text-sm text-gray-600">
              {selectedSeats.length} ghế x 300,000₫ ={' '}
              {(selectedSeats.length * 300000).toLocaleString('vi-VN')}₫
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed" onClick={() => onSeatSelect(selectedSeats)} disabled={selectedSeats.length === 0}>
            Tiếp tục
          </button>
        </div>
      </div>
    </div>;
};
export default SeatSelection;