import axiosInstance from './axiosInstance';
import { BookingOrderDetails, BookingPaymentDetails, VNPayPaymentRequest, VNPayPaymentResponse, VNPayPaymentStatus } from '../types';

const paymentsServices = {
  // VNPay payment methods
  vnpay: {
    create: async (data: VNPayPaymentRequest): Promise<VNPayPaymentResponse> => {
      const response = await axiosInstance.post<VNPayPaymentResponse>('/payment/vnpay', data);
      return response.data;
    },

    handleReturn: async (queryParams: string): Promise<VNPayPaymentStatus> => {
      const response = await axiosInstance.get<VNPayPaymentStatus>(`/payment/vnpay-return${queryParams}`);
      return response.data;
    },

    handleIPN: async (queryParams: string): Promise<VNPayPaymentStatus> => {
      const response = await axiosInstance.get<VNPayPaymentStatus>(`/payment/vnpay-ipn${queryParams}`);
      return response.data;
    }
  },

  // General payment methods
  getPaymentDetails: async (orderId: string): Promise<BookingPaymentDetails> => {
    const response = await axiosInstance.get<{success: boolean; data: BookingPaymentDetails}>(`/payment/details/${orderId}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch payment details');
  },

  getBookingDetails: async (orderId: string): Promise<BookingOrderDetails> => {
    const response = await axiosInstance.get<{success: boolean; data: BookingOrderDetails}>(`/payment/booking-details/${orderId}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch booking details');
  }
};

export default paymentsServices;
