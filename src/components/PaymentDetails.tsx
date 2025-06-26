import React from 'react';
import { BookingPaymentDetails } from '../types';
import { formatters, vnpay } from '../utils/paymentUtils';

interface PaymentDetailsProps {
  paymentData: BookingPaymentDetails;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ paymentData }) => {
  const getPaymentStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            Thành công
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
            </svg>
            Đang xử lý
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
            Thất bại
          </span>
        );
      default:
        return status;
    }
  };

  const paymentSummary = vnpay.generatePaymentSummary(paymentData);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Chi tiết thanh toán</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã đơn hàng</label>
              <p className="text-gray-900">{paymentSummary.orderId}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền</label>
              <p className="text-gray-900">{paymentSummary.formattedAmount}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              {getPaymentStatusDisplay(paymentSummary.status)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã giao dịch</label>
              <p className="text-gray-900">{paymentSummary.transactionId || 'N/A'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian xử lý</label>
              <p className="text-gray-900">{paymentSummary.processedAt}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian tạo</label>
              <p className="text-gray-900">{paymentSummary.createdAt}</p>
            </div>

            {paymentSummary.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <p className="text-gray-900">{paymentSummary.notes}</p>
              </div>
            )}
          </div>
        </div>

        {paymentSummary.vnpayDetails && (
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết từ VNPay</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Mã ngân hàng
                  </label>
                  <p className="text-gray-900 font-medium">{paymentSummary.vnpayDetails.bankCode}</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Loại thẻ
                  </label>
                  <p className="text-gray-900 font-medium">{paymentSummary.vnpayDetails.cardType}</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Mã giao dịch ngân hàng
                  </label>
                  <p className="text-gray-900 font-medium">{paymentSummary.vnpayDetails.bankTransactionNo}</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Thời gian thanh toán
                  </label>
                  <p className="text-gray-900 font-medium">{paymentSummary.vnpayDetails.payDate}</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Trạng thái
                  </label>
                  <p className="text-gray-900 font-medium">{paymentSummary.vnpayDetails.responseMessage}</p>
                </div>

                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Thông tin đơn hàng
                  </label>
                  <p className="text-gray-900 font-medium break-words">
                    {paymentSummary.vnpayDetails.orderInfo}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;
