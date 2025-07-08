import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface NoResultsProps {
  hasTrips: boolean;
}

const NoResults: React.FC<NoResultsProps> = ({ hasTrips }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-lg p-8 text-center"
    >
      <div className="mb-4">
        <span className="inline-block p-3 bg-gray-100 rounded-full">
          <Search className="h-6 w-6 text-gray-400" />
        </span>
      </div>
      <p className="text-gray-700 text-lg font-medium">
        {hasTrips 
          ? "Không có chuyến xe nào phù hợp với bộ lọc" 
          : "Không tìm thấy chuyến xe nào phù hợp"
        }
      </p>
      <p className="text-gray-600 mt-2">
        {hasTrips 
          ? "Vui lòng thử điều chỉnh bộ lọc hoặc tìm kiếm lại"
          : "Vui lòng thử lại với các tiêu chí tìm kiếm khác"
        }
      </p>
    </motion.div>
  );
};

export default NoResults;
