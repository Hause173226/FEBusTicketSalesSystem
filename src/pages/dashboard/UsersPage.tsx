import React from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  joinDate: string;
}

const sampleUsers: User[] = [
  {
    id: 'U001',
    name: 'Phạm Thị Mai',
    email: 'mai.pham@example.com',
    phone: '0934567890',
    role: 'user',
    status: 'active',
    joinDate: '2024-01-15',
  },
  {
    id: 'U002',
    name: 'Hoàng Minh Tuấn',
    email: 'tuan.hoang@example.com',
    phone: '0945678901',
    role: 'admin',
    status: 'active',
    joinDate: '2023-12-01',
  },
  {
    id: 'U003',
    name: 'Nguyễn Thu Hà',
    email: 'ha.nguyen@example.com',
    phone: '0956789012',
    role: 'user',
    status: 'inactive',
    joinDate: '2024-02-20',
  },
];

const UsersPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b">Mã người dùng</th>
              <th className="px-6 py-3 border-b">Họ tên</th>
              <th className="px-6 py-3 border-b">Email</th>
              <th className="px-6 py-3 border-b">Số điện thoại</th>
              <th className="px-6 py-3 border-b">Vai trò</th>
              <th className="px-6 py-3 border-b">Trạng thái</th>
              <th className="px-6 py-3 border-b">Ngày tham gia</th>
            </tr>
          </thead>
          <tbody>
            {sampleUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b">{user.id}</td>
                <td className="px-6 py-4 border-b">{user.name}</td>
                <td className="px-6 py-4 border-b">{user.email}</td>
                <td className="px-6 py-4 border-b">{user.phone}</td>
                <td className="px-6 py-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                  </span>
                </td>
                <td className="px-6 py-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </td>
                <td className="px-6 py-4 border-b">{user.joinDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage; 