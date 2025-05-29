import React from 'react';
export const routes = [{
  id: 1,
  from: 'Hà Nội',
  to: 'Hồ Chí Minh',
  price: 1200000,
  duration: '48 giờ',
  distance: '1700 km',
  image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=1470&auto=format&fit=crop',
  departureTime: ['06:00', '19:00', '21:00'],
  busCompany: 'Phương Trang',
  busType: 'Giường nằm cao cấp'
}, {
  id: 2,
  from: 'Hà Nội',
  to: 'Đà Nẵng',
  price: 750000,
  duration: '16 giờ',
  distance: '800 km',
  image: 'https://images.unsplash.com/photo-1624952718915-9d9ca0a0acd1?q=80&w=1470&auto=format&fit=crop',
  departureTime: ['07:30', '20:00'],
  busCompany: 'Hoàng Long',
  busType: 'Limousine 9 chỗ'
}, {
  id: 3,
  from: 'Hồ Chí Minh',
  to: 'Đà Lạt',
  price: 280000,
  duration: '8 giờ',
  distance: '300 km',
  image: 'https://images.unsplash.com/photo-1595255958099-eca67a8f002b?q=80&w=1470&auto=format&fit=crop',
  departureTime: ['08:00', '13:00', '23:00'],
  busCompany: 'Thành Bưởi',
  busType: 'Giường nằm thường'
}, {
  id: 4,
  from: 'Hồ Chí Minh',
  to: 'Vũng Tàu',
  price: 150000,
  duration: '2.5 giờ',
  distance: '120 km',
  image: 'https://images.unsplash.com/photo-1605733513597-a8f8341084e6?q=80&w=1528&auto=format&fit=crop',
  departureTime: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00'],
  busCompany: 'Kumho Samco',
  busType: 'Ghế ngồi cao cấp'
}, {
  id: 5,
  from: 'Hà Nội',
  to: 'Hải Phòng',
  price: 120000,
  duration: '2 giờ',
  distance: '120 km',
  image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=1471&auto=format&fit=crop',
  departureTime: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
  busCompany: 'Hải Âu',
  busType: 'Ghế ngồi thường'
}, {
  id: 6,
  from: 'Hồ Chí Minh',
  to: 'Cần Thơ',
  price: 190000,
  duration: '4 giờ',
  distance: '170 km',
  image: 'https://images.unsplash.com/photo-1588492288577-8d017f011258?q=80&w=1471&auto=format&fit=crop',
  departureTime: ['07:00', '09:00', '11:00', '13:00', '15:00'],
  busCompany: 'Phương Trang',
  busType: 'Giường nằm thường'
}];
export const busLayout = {
  rows: 10,
  columns: 4,
  aisle: [1, 2],
  unavailableSeats: [3, 12, 15, 28, 33]
};
export const formatPrice = price => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};