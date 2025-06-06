import React from 'react';

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseClass: string;
  phone: string;
  experience: number;
  status: 'available' | 'on_trip' | 'off_duty';
}

const sampleDrivers: Driver[] = [
  {
    id: 'D001',
    name: 'Nguyễn Văn An',
    licenseNumber: 'B2-123456',
    licenseClass: 'B2',
    phone: '0901234567',
    experience: 5,
    status: 'available',
  },
  {
    id: 'D002',
    name: 'Trần Minh Bình',
    licenseNumber: 'D-234567',
    licenseClass: 'D',
    phone: '0912345678',
    experience: 8,
    status: 'on_trip',
  },
  {
    id: 'D003',
    name: 'Lê Hoàng Cường',
    licenseNumber: 'E-345678',
    licenseClass: 'E',
    phone: '0923456789',
    experience: 10,
    status: 'off_duty',
  },
];

const DriversPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý tài xế</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b">Mã tài xế</th>
              <th className="px-6 py-3 border-b">Họ tên</th>
              <th className="px-6 py-3 border-b">Số GPLX</th>
              <th className="px-6 py-3 border-b">Hạng bằng</th>
              <th className="px-6 py-3 border-b">Số điện thoại</th>
              <th className="px-6 py-3 border-b">Kinh nghiệm (năm)</th>
              <th className="px-6 py-3 border-b">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {sampleDrivers.map((driver) => (
              <tr key={driver.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b">{driver.id}</td>
                <td className="px-6 py-4 border-b">{driver.name}</td>
                <td className="px-6 py-4 border-b">{driver.licenseNumber}</td>
                <td className="px-6 py-4 border-b">{driver.licenseClass}</td>
                <td className="px-6 py-4 border-b">{driver.phone}</td>
                <td className="px-6 py-4 border-b">{driver.experience}</td>
                <td className="px-6 py-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    driver.status === 'available'
                      ? 'bg-green-100 text-green-800'
                      : driver.status === 'on_trip'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {driver.status === 'available'
                      ? 'Sẵn sàng'
                      : driver.status === 'on_trip'
                      ? 'Đang chạy'
                      : 'Nghỉ'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriversPage; 