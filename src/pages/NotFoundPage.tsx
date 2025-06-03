import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="pt-16 pb-12">
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-144px)]">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-blue-700">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-4 mb-6">
            Trang không tìm thấy
          </h2>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;