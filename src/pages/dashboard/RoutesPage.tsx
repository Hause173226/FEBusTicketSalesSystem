import React from 'react';

interface Route {
  id: string;
  from: string;
  to: string;
  distance: number;
  duration: string;
  price: number;
  status: 'active' | 'inactive';
}

const sampleRoutes: Route[] = [
  {
    id: 'R001',
    from: 'Hà Nội',
    to: 'Hồ Chí Minh',
    distance: 1760,
    duration: '32h',
    price: 1200000,
    status: 'active',
  },
  {
    id: 'R002',
    from: 'Hà Nội',
    to: 'Đà Nẵng',
    distance: 760,
    duration: '14h',
    price: 600000,
    status: 'active',
  },
  {
    id: 'R003',
    from: 'Hồ Chí Minh',
    to: 'Đà Lạt',
    distance: 310,
    duration: '8h',
    price: 300000,
    status: 'active',
  },
];

const RoutesPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý tuyến xe</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b">Mã tuyến</th>
              <th className="px-6 py-3 border-b">Điểm đi</th>
              <th className="px-6 py-3 border-b">Điểm đến</th>
              <th className="px-6 py-3 border-b">Khoảng cách</th>
              <th className="px-6 py-3 border-b">Thời gian</th>
              <th className="px-6 py-3 border-b">Giá vé</th>
              <th className="px-6 py-3 border-b">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {sampleRoutes.map((route) => (
              <tr key={route.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b">{route.id}</td>
                <td className="px-6 py-4 border-b">{route.from}</td>
                <td className="px-6 py-4 border-b">{route.to}</td>
                <td className="px-6 py-4 border-b">{route.distance} km</td>
                <td className="px-6 py-4 border-b">{route.duration}</td>
                <td className="px-6 py-4 border-b">{route.price.toLocaleString()} VND</td>
                <td className="px-6 py-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    route.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {route.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
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

export default RoutesPage; 