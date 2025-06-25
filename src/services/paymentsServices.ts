import axiosInstance from './axiosInstance';
import { VNPayPaymentRequest, VNPayPaymentResponse, VNPayPaymentStatus, BookingPaymentDetails } from '../types';

const paymentsServices = {
  // Create a new VNPay payment
  createVNPayPayment: async (paymentData: VNPayPaymentRequest): Promise<VNPayPaymentResponse> => {
    try {
      const response = await axiosInstance.post('/api/payment/vnpay', paymentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Handle VNPay payment return (Client Return URL)
  handleVNPayReturn: async (queryParams: string): Promise<VNPayPaymentStatus> => {
    try {
      const response = await axiosInstance.get(`/api/payment/vnpay-return${queryParams}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Handle VNPay IPN (Instant Payment Notification)
  handleVNPayIPN: async (queryParams: string): Promise<VNPayPaymentStatus> => {
    try {
      const response = await axiosInstance.get(`/api/payment/vnpay-ipn${queryParams}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get booking payment details
  getBookingPaymentDetails: async (orderId: string): Promise<BookingPaymentDetails> => {
    try {
      const response = await axiosInstance.get(`/api/payment/booking-details/${orderId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default paymentsServices;
