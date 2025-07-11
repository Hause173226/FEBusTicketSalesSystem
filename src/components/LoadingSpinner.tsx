import React from 'react';

interface LoadingSpinnerProps {
  title?: string;
  description?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  title = "Đang xử lý...", 
  description = "Vui lòng đợi trong giây lát",
  size = 'medium'
}) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12', 
    large: 'h-16 w-16'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <div className={`animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2 border-blue-500 mx-auto`}></div>
        <h2 className="mt-4 text-lg font-semibold text-gray-800">{title}</h2>
        <p className="mt-2 text-gray-600">{description}</p>
        <p className="mt-2 text-sm text-gray-500">Vui lòng không tắt trình duyệt</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
