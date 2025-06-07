import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { paymentMethods } from '../data';
import { useAppContext } from '../context/AppContext';

interface PaymentMethodsProps {
  onPaymentComplete: (bookingId: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ onPaymentComplete }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  
  const { createBooking } = useAppContext();
  const navigate = useNavigate();

  const handleSelectMethod = (methodId: string) => {
    setSelectedMethod(methodId);
    setShowForm(methodId === 'bankcard');
  };

  const handleCardFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardForm({
      ...cardForm,
      [name]: value,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMethod) {
      alert('Vui lòng chọn phương thức thanh toán');
      return;
    }
    
    if (selectedMethod === 'bankcard') {
      // Validate card form
      if (!cardForm.cardNumber || !cardForm.cardHolder || !cardForm.expiryDate || !cardForm.cvv) {
        alert('Vui lòng điền đầy đủ thông tin thẻ');
        return;
      }
    }
    
    try {
      setIsProcessing(true);
      
      // Create booking with selected payment method
      const booking = await createBooking(
        selectedMethod === 'bankcard' ? 'Bank Card' : selectedMethod === 'momo' ? 'Momo' : selectedMethod
      );
      
      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false);
        onPaymentComplete(booking.id);
        navigate(`/ticket/${booking.id}`);
      }, 2000);
      
    } catch (error) {
      setIsProcessing(false);
      alert('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Phương thức thanh toán</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`
                border rounded-lg p-4 cursor-pointer transition-all duration-200
                ${selectedMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}
              `}
              onClick={() => handleSelectMethod(method.id)}
            >
              <div className="flex items-center">
                <div className="mr-3">
                  {method.id === 'momo' ? (
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      M
                    </div>
                  ) : method.id === 'bankcard' ? (
                    <CreditCard className="w-10 h-10 text-blue-500" />
                  ) : method.id === 'zalopay' ? (
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      Z
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                      $
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{method.name}</h4>
                </div>
                {selectedMethod === method.id && (
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Bank Card Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 p-4 border border-gray-300 rounded-lg"
          >
            <h4 className="font-medium text-gray-800 mb-3">Thông tin thẻ</h4>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Số thẻ
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={cardForm.cardNumber}
                  onChange={handleCardFormChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              
              <div>
                <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
                  Tên chủ thẻ
                </label>
                <input
                  type="text"
                  id="cardHolder"
                  name="cardHolder"
                  value={cardForm.cardHolder}
                  onChange={handleCardFormChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="NGUYEN VAN A"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày hết hạn
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={cardForm.expiryDate}
                    onChange={handleCardFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={cardForm.cvv}
                    onChange={handleCardFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123"
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <button
          type="submit"
          disabled={!selectedMethod || isProcessing}
          className={`
            w-full py-3 rounded-md transition-colors duration-200 flex items-center justify-center
            ${isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : !selectedMethod
              ? 'bg-gray-300 cursor-not-allowed text-gray-500'
              : 'bg-blue-700 hover:bg-blue-800 text-white'
            }
          `}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            'Thanh toán'
          )}
        </button>
      </form>
    </div>
  );
};

export default PaymentMethods;