import { useState, useEffect } from 'react';
import { BookingPaymentDetails, BookingOrderDetails } from '../types';
import paymentsServices from '../services/paymentsServices';

interface UsePaymentDetailsResult {
  paymentData: BookingPaymentDetails | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseBookingDetailsResult {
  bookingData: BookingOrderDetails | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePaymentDetails = (orderId: string | undefined): UsePaymentDetailsResult => {
  const [paymentData, setPaymentData] = useState<BookingPaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentDetails = async () => {
    if (!orderId) {
      setError('Mã đơn hàng không hợp lệ');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await paymentsServices.getPaymentDetails(orderId);
      setPaymentData(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Không thể tải thông tin thanh toán';
      setError(errorMessage);
      setPaymentData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
  }, [orderId]);

  const refetch = () => {
    fetchPaymentDetails();
  };

  return {
    paymentData,
    loading,
    error,
    refetch,
  };
};

export const useBookingDetails = (orderId: string | undefined): UseBookingDetailsResult => {
  const [bookingData, setBookingData] = useState<BookingOrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookingDetails = async () => {
    if (!orderId) {
      setError('Mã đơn hàng không hợp lệ');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await paymentsServices.getBookingDetails(orderId);
      setBookingData(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Không thể tải thông tin đặt vé';
      setError(errorMessage);
      setBookingData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [orderId]);

  const refetch = () => {
    fetchBookingDetails();
  };

  return {
    bookingData,
    loading,
    error,
    refetch,
  };
};

// Hook để lấy cả payment details và booking details
export const useOrderDetails = (orderId: string | undefined) => {
  const paymentDetails = usePaymentDetails(orderId);
  const bookingDetails = useBookingDetails(orderId);

  return {
    payment: paymentDetails,
    booking: bookingDetails,
    isLoading: paymentDetails.loading || bookingDetails.loading,
    hasError: paymentDetails.error || bookingDetails.error,
    refetchAll: () => {
      paymentDetails.refetch();
      bookingDetails.refetch();
    },
  };
};
