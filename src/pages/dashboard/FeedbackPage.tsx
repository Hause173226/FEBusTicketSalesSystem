import React from 'react';

interface Feedback {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  message: string;
  rating: number;
  status: 'new' | 'in_progress' | 'resolved';
  createdAt: string;
}

const sampleFeedback: Feedback[] = [
  {
    id: 'F001',
    userId: 'U001',
    userName: 'Phạm Thị Mai',
    subject: 'Phản hồi về dịch vụ',
    message: 'Tài xế rất thân thiện và chuyên nghiệp. Xe sạch sẽ và đúng giờ.',
    rating: 5,
    status: 'resolved',
    createdAt: '2024-03-14 10:30',
  },
  {
    id: 'F002',
    userId: 'U003',
    userName: 'Nguyễn Thu Hà',
    subject: 'Vấn đề về đặt vé',
    message: 'Không thể thanh toán bằng thẻ tín dụng. Cần hỗ trợ gấp.',
    rating: 2,
    status: 'in_progress',
    createdAt: '2024-03-15 09:15',
  },
  {
    id: 'F003',
    userId: 'U002',
    userName: 'Hoàng Minh Tuấn',
    subject: 'Góp ý cải thiện',
    message: 'Nên bổ sung thêm các tuyến xe vào buổi tối.',
    rating: 4,
    status: 'new',
    createdAt: '2024-03-15 16:45',
  },
];

const FeedbackPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý phản hồi</h1>
      <div className="grid gap-6">
        {sampleFeedback.map((feedback) => (
          <div key={feedback.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold">{feedback.subject}</h2>
                <p className="text-sm text-gray-600">
                  Từ: {feedback.userName} • {feedback.createdAt}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-sm ${
                  feedback.status === 'new'
                    ? 'bg-blue-100 text-blue-800'
                    : feedback.status === 'in_progress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {feedback.status === 'new'
                    ? 'Mới'
                    : feedback.status === 'in_progress'
                    ? 'Đang xử lý'
                    : 'Đã giải quyết'}
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      className={`w-4 h-4 ${
                        index < feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{feedback.message}</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Phản hồi
              </button>
              {feedback.status !== 'resolved' && (
                <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100">
                  Đánh dấu đã giải quyết
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackPage;