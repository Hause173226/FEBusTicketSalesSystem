import { BookingPaymentDetails } from '../types';

// Consolidated formatting functions
export const formatters = {
  currency: (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  },

  dateTime: (dateString: string): string => {
    return new Date(dateString).toLocaleString('vi-VN');
  },

  date: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  }
};

// VNPay specific utilities
export const vnpay = {
  getResponseMessage: (code: string): string => {
    const codeMap: { [key: string]: string } = {
      '00': 'Giao dịch thành công',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
      '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.',
      '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)',
    };
    return codeMap[code] || `Mã lỗi: ${code}`;
  },

  generatePaymentSummary: (paymentData: BookingPaymentDetails) => {
    return {
      orderId: paymentData._id,
      amount: paymentData.amount,
      formattedAmount: formatters.currency(paymentData.amount),
      status: paymentData.paymentStatus,
      processedAt: formatters.dateTime(paymentData.processedAt),
      createdAt: formatters.dateTime(paymentData.createdAt),
      transactionId: paymentData.transactionId,
      notes: paymentData.notes,
      vnpayDetails: paymentData.gatewayResponse ? {
        bankCode: paymentData.gatewayResponse.vnp_BankCode,
        cardType: paymentData.gatewayResponse.vnp_CardType,
        bankTransactionNo: paymentData.gatewayResponse.vnp_BankTranNo,
        responseMessage: vnpay.getResponseMessage(paymentData.gatewayResponse.vnp_ResponseCode),
        payDate: paymentData.gatewayResponse.vnp_PayDate,
        orderInfo: decodeURIComponent(paymentData.gatewayResponse.vnp_OrderInfo),
      } : null,
    };
  }
};

export const getPaymentMethodDisplayName = (method: string): string => {
  const methodMap: { [key: string]: string } = {
    'vnpay': 'VNPay',
    'online': 'Thanh toán trực tuyến',
    'cash': 'Tiền mặt',
    'bank_transfer': 'Chuyển khoản ngân hàng',
    'credit_card': 'Thẻ tín dụng',
    'debit_card': 'Thẻ ghi nợ',
  };
  
  return methodMap[method.toLowerCase()] || method;
};

export const getPaymentStatusDisplayName = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'success': 'Thành công',
    'pending': 'Đang xử lý',
    'failed': 'Thất bại',
    'cancelled': 'Đã hủy',
    'refunded': 'Đã hoàn tiền',
  };
  
  return statusMap[status.toLowerCase()] || status;
};

export const validateOrderId = (orderId: string): boolean => {
  // Kiểm tra định dạng orderId (ví dụ: ObjectId format hoặc custom format)
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(orderId) || orderId.length > 0;
};
