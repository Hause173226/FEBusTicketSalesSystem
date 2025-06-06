import React from 'react';

interface Payment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  method: 'credit_card' | 'bank_transfer' | 'momo' | 'cash';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
}

const samplePayments: Payment[] = [
  {
    id: 'P001',
    userId: 'U001',
    userName: 'Phạm Thị Mai',
    amount: 500000,
    method: 'momo',
    status: 'completed',
    date: '2024-03-15 14:30',
    description: 'Thanh toán vé xe Hà Nội - Đà Nẵng',
  },
  {
    id: 'P002',
    userId: 'U003',
    userName: 'Nguyễn Thu Hà',
    amount: 1200000,
    method: 'credit_card',
    status: 'pending',
    date: '2024-03-15 15:45',
    description: 'Thanh toán vé xe Hà Nội - Hồ Chí Minh',
  },
  {
    id: 'P003',
    userId: 'U002',
    userName: 'Hoàng Minh Tuấn',
    amount: 300000,
    method: 'bank_transfer',
    status: 'completed',
    date: '2024-03-14 09:15',
    description: 'Thanh toán vé xe Đà Nẵng - Huế',
  },
];

const PaymentsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý thanh toán</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b">Mã giao dịch</th>
              <th className="px-6 py-3 border-b">Người dùng</th>
              <th className="px-6 py-3 border-b">Số tiền</th>
              <th className="px-6 py-3 border-b">Phương thức</th>
              <th className="px-6 py-3 border-b">Trạng thái</th>
              <th className="px-6 py-3 border-b">Thời gian</th>
              <th className="px-6 py-3 border-b">Mô tả</th>
            </tr>
          </thead>
          <tbody>
            {samplePayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b">{payment.id}</td>
                <td className="px-6 py-4 border-b">{payment.userName}</td>
                <td className="px-6 py-4 border-b">{payment.amount.toLocaleString()} VND</td>
                <td className="px-6 py-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    payment.method === 'credit_card'
                      ? 'bg-blue-100 text-blue-800'
                      : payment.method === 'bank_transfer'
                      ? 'bg-green-100 text-green-800'
                      : payment.method === 'momo'
                      ? 'bg-pink-100 text-pink-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {payment.method === 'credit_card'
                      ? 'Thẻ tín dụng'
                      : payment.method === 'bank_transfer'
                      ? 'Chuyển khoản'
                      : payment.method === 'momo'
                      ? 'Ví MoMo'
                      : 'Tiền mặt'}
                  </span>
                </td>
                <td className="px-6 py-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    payment.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : payment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {payment.status === 'completed'
                      ? 'Hoàn thành'
                      : payment.status === 'pending'
                      ? 'Đang xử lý'
                      : 'Thất bại'}
                  </span>
                </td>
                <td className="px-6 py-4 border-b">{payment.date}</td>
                <td className="px-6 py-4 border-b">{payment.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsPage; 