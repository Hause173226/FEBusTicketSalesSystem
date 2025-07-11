import React from 'react';
import { PhoneIcon, MailIcon, ClockIcon } from 'lucide-react';

const PaymentFailureHelper: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-6">
      <h3 className="font-medium text-blue-800 mb-3">Cần hỗ trợ?</h3>
      <div className="space-y-2 text-sm text-blue-700">
        <div className="flex items-center gap-2">
          <PhoneIcon className="h-4 w-4" />
          <span>Hotline: 1900-1234 (7:00 - 22:00)</span>
        </div>
        <div className="flex items-center gap-2">
          <MailIcon className="h-4 w-4" />
          <span>Email: support@busticket.com</span>
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="h-4 w-4" />
          <span>Thời gian phản hồi: Trong vòng 30 phút</span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-blue-200">
        <p className="text-xs text-blue-600">
          💡 <strong>Mẹo:</strong> Hãy chụp màn hình trang này để gửi cho bộ phận hỗ trợ khi cần thiết
        </p>
      </div>
    </div>
  );
};

export default PaymentFailureHelper;
