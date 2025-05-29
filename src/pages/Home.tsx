import React, { useState } from 'react';
import SearchForm from '../components/SearchForm';
import RouteCard from '../components/RouteCard';
import { routes } from '../utils/data';
import { BusIcon, MapIcon, CreditCardIcon, CheckIcon } from 'lucide-react';
const Home = () => {
  const [filteredRoutes, setFilteredRoutes] = useState(routes);
  const handleSearch = searchParams => {
    // Filter routes based on search parameters
    const filtered = routes.filter(route => {
      if (searchParams.from && route.from !== searchParams.from) return false;
      if (searchParams.to && route.to !== searchParams.to) return false;
      return true;
    });
    setFilteredRoutes(filtered);
  };
  return <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1469&auto=format&fit=crop" alt="Bus on highway" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Đặt vé xe liên tỉnh dễ dàng, nhanh chóng
            </h1>
            <p className="text-xl mb-8">
              Hệ thống đặt vé xe khách liên tỉnh trực tuyến với hàng trăm tuyến
              đường trên toàn quốc.
            </p>
          </div>
          <div className="mt-8">
            <SearchForm onSearch={handleSearch} />
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Tại sao chọn VIET BUS?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <BusIcon size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nhiều lựa chọn</h3>
              <p className="text-gray-600">
                Hơn 500 tuyến đường và 300 nhà xe uy tín trên toàn quốc.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <MapIcon size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dễ dàng đặt vé</h3>
              <p className="text-gray-600">
                Đặt vé chỉ với vài thao tác đơn giản, tiết kiệm thời gian.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-yellow-100 p-4 rounded-full mb-4">
                <CreditCardIcon size={32} className="text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Thanh toán an toàn</h3>
              <p className="text-gray-600">
                Nhiều phương thức thanh toán an toàn và bảo mật.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <CheckIcon size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dịch vụ chất lượng</h3>
              <p className="text-gray-600">
                Đảm bảo chất lượng dịch vụ với hệ thống đánh giá minh bạch.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Popular Routes Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            Tuyến đường phổ biến
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutes.map(route => <RouteCard key={route.id} route={route} />)}
          </div>
          {filteredRoutes.length === 0 && <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Không tìm thấy tuyến đường phù hợp. Vui lòng thử lại với tìm
                kiếm khác.
              </p>
            </div>}
        </div>
      </section>
    </div>;
};
export default Home;