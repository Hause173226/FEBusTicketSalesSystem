import { BusLayout, City, PaymentMethod, Route, User } from '../types';

export const cities: City[] = [
  { id: '1', name: 'Hà Nội' },
  { id: '2', name: 'Hồ Chí Minh' },
  { id: '3', name: 'Đà Nẵng' },
  { id: '4', name: 'Huế' },
  { id: '5', name: 'Nha Trang' },
  { id: '6', name: 'Đà Lạt' },
  { id: '7', name: 'Hải Phòng' },
  { id: '8', name: 'Cần Thơ' },
  { id: '9', name: 'Vũng Tàu' },
  { id: '10', name: 'Phan Thiết' },
];

export const routes: Route[] = [
  {
    id: '1',
    from: 'Hà Nội',
    to: 'Hồ Chí Minh',
    departureTime: '08:00',
    arrivalTime: '18:00',
    price: 1200000,
    company: 'Phương Trang',
    busType: 'Giường nằm cao cấp',
    totalSeats: 36,
    availableSeats: 22,
    popular: true,
  },
  {
    id: '2',
    from: 'Hà Nội',
    to: 'Đà Nẵng',
    departureTime: '20:00',
    arrivalTime: '08:00',
    price: 800000,
    company: 'Hoàng Long',
    busType: 'Giường nằm',
    totalSeats: 40,
    availableSeats: 15,
    popular: true,
  },
  {
    id: '3',
    from: 'Hồ Chí Minh',
    to: 'Đà Lạt',
    departureTime: '07:30',
    arrivalTime: '13:30',
    price: 300000,
    company: 'Thành Bưởi',
    busType: 'Limousine',
    totalSeats: 22,
    availableSeats: 8,
    popular: true,
  },
  {
    id: '4',
    from: 'Hồ Chí Minh',
    to: 'Vũng Tàu',
    departureTime: '06:00',
    arrivalTime: '09:00',
    price: 150000,
    company: 'Kumho Samco',
    busType: 'Thường',
    totalSeats: 45,
    availableSeats: 30,
    popular: true,
  },
  {
    id: '5',
    from: 'Đà Nẵng',
    to: 'Huế',
    departureTime: '09:00',
    arrivalTime: '11:30',
    price: 120000,
    company: 'Huế Tourist',
    busType: 'Limousine',
    totalSeats: 16,
    availableSeats: 10,
    popular: false,
  },
  {
    id: '6',
    from: 'Nha Trang',
    to: 'Đà Lạt',
    departureTime: '10:00',
    arrivalTime: '14:00',
    price: 210000,
    company: 'Phương Trang',
    busType: 'Giường nằm',
    totalSeats: 36,
    availableSeats: 25,
    popular: false,
  },
  {
    id: '7',
    from: 'Hồ Chí Minh',
    to: 'Cần Thơ',
    departureTime: '07:00',
    arrivalTime: '10:30',
    price: 180000,
    company: 'Phương Trang',
    busType: 'Thường',
    totalSeats: 45,
    availableSeats: 20,
    popular: true,
  },
  {
    id: '8',
    from: 'Hà Nội',
    to: 'Hải Phòng',
    departureTime: '06:30',
    arrivalTime: '08:30',
    price: 120000,
    company: 'Hoàng Long',
    busType: 'Thường',
    totalSeats: 40,
    availableSeats: 25,
    popular: false,
  },
];

export const busLayout: BusLayout = {
  rows: 9,
  columns: 4,
  aisleAfterColumn: 2,
  seats: Array(36)
    .fill(null)
    .map((_, index) => {
      const row = Math.floor(index / 4) + 1;
      const col = (index % 4) + 1;
      let seatNumber = '';
      
      if (col <= 2) {
        seatNumber = `A${row}${col === 1 ? 'L' : 'R'}`;
      } else {
        seatNumber = `B${row}${col === 3 ? 'L' : 'R'}`;
      }
      
      return {
        id: `seat-${index + 1}`,
        number: seatNumber,
        isAvailable: Math.random() > 0.3,
        price: 0, // This will be set based on the route
        type: index < 8 ? 'vip' : index < 20 ? 'premium' : 'standard',
      };
    }),
};

export const mockUser: User = {
  id: 'user-1',
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone: '0901234567',
  bookings: [
    {
      id: 'booking-1',
      routeId: '3',
      userId: 'user-1',
      seatIds: ['seat-5', 'seat-6'],
      totalPrice: 600000,
      bookingDate: '2023-06-10',
      travelDate: '2023-06-20',
      status: 'confirmed',
      paymentMethod: 'Momo',
    },
    {
      id: 'booking-2',
      routeId: '7',
      userId: 'user-1',
      seatIds: ['seat-10'],
      totalPrice: 180000,
      bookingDate: '2023-05-15',
      travelDate: '2023-05-25',
      status: 'completed',
      paymentMethod: 'Bank Card',
    },
  ],
};

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'momo',
    name: 'Ví MoMo',
    icon: '/icons/momo.png',
  },
  {
    id: 'bankcard',
    name: 'Thẻ ngân hàng',
    icon: '/icons/bank-card.png',
  },
  {
    id: 'zalopay',
    name: 'ZaloPay',
    icon: '/icons/zalopay.png',
  },
  {
    id: 'cash',
    name: 'Tiền mặt',
    icon: '/icons/cash.png',
  },
];