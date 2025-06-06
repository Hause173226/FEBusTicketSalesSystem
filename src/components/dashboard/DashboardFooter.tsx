import React from 'react';

const DashboardFooter: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-md z-[51]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            © 2024 BusGo Admin. All rights reserved.
          </p>
          <div className="mt-2 md:mt-0">
            <p className="text-sm text-gray-500">
              Version 1.0.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter; 