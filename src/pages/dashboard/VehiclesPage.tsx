import React from 'react';

interface Vehicle {
  id: string;
  licensePlate: string;
  model: string;
  capacity: number;
  manufactureYear: number;
  lastMaintenance: string;
  status: 'active' | 'maintenance' | 'inactive';
}

const sampleVehicles: Vehicle[] = [
  {
    id: 'V001',
    licensePlate: '29A-12345',
    model: 'Thaco Universe',
    capacity: 45,
    manufactureYear: 2020,
    lastMaintenance: '2024-02-15',
    status: 'active',
  },
  {
    id: 'V002',
    licensePlate: '30A-67890',
    model: 'Hyundai Universe',
    capacity: 40,
    manufactureYear: 2021,
    lastMaintenance: '2024-01-20',
    status: 'active',
  },
  {
    id: 'V003',
    licensePlate: '51A-54321',
    model: 'Thaco Meadow',
    capacity: 35,
    manufactureYear: 2019,
    lastMaintenance: '2024-03-01',
    status: 'maintenance',
  },
];

const VehiclesPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý xe</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b">Mã xe</th>
              <th className="px-6 py-3 border-b">Biển số</th>
              <th className="px-6 py-3 border-b">Model</th>
              <th className="px-6 py-3 border-b">Số ghế</th>
              <th className="px-6 py-3 border-b">Năm sản xuất</th>
              <th className="px-6 py-3 border-b">Bảo dưỡng gần nhất</th>
              <th className="px-6 py-3 border-b">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {sampleVehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b">{vehicle.id}</td>
                <td className="px-6 py-4 border-b">{vehicle.licensePlate}</td>
                <td className="px-6 py-4 border-b">{vehicle.model}</td>
                <td className="px-6 py-4 border-b">{vehicle.capacity}</td>
                <td className="px-6 py-4 border-b">{vehicle.manufactureYear}</td>
                <td className="px-6 py-4 border-b">{vehicle.lastMaintenance}</td>
                <td className="px-6 py-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    vehicle.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : vehicle.status === 'maintenance'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {vehicle.status === 'active' 
                      ? 'Hoạt động'
                      : vehicle.status === 'maintenance'
                      ? 'Đang bảo dưỡng'
                      : 'Không hoạt động'}
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

export default VehiclesPage; 