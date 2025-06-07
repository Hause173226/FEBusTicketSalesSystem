import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Clock, CheckCircle, Shield } from "lucide-react";
import SearchForm from "../components/SearchForm";
import RouteCard from "../components/RouteCard";
import { routes } from "../data";
import { userServices } from "../services/userServices";

const HomePage: React.FC = () => {
  const popularRoutes = routes.filter((route) => route.popular);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userServices.getUser();
        console.log("res", res);

        if (res.status === 200) {
          setUser(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      console.log("User data:", user);
    }
  }, [user]);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] bg-gray-900 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 opacity-50"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/68629/pexels-photo-68629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>

        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-20">
          <motion.h1
            className="text-3xl md:text-5xl font-bold text-white text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Đặt vé nhanh – Giá tốt – Tiện lợi
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-200 text-center mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Hệ thống đặt vé xe liên tỉnh trực tuyến lớn nhất Việt Nam với hơn
            500 tuyến đường, 100 nhà xe uy tín
          </motion.p>
        </div>
      </section>

      {/* Search Form Section */}
      <section className="container mx-auto px-4 -mt-24 relative z-30 mb-12">
        <SearchForm />
      </section>

      {/* Popular Routes Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Tuyến phổ biến
          </h2>
          <p className="text-gray-600">
            Khám phá các tuyến đường được yêu thích nhất
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularRoutes.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/routes"
            className="inline-block px-6 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors duration-200"
          >
            Xem tất cả tuyến
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Tại sao chọn BusGo?
            </h2>
            <p className="text-gray-600">
              Chúng tôi cung cấp dịch vụ đặt vé xe trực tuyến tốt nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md text-center"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-blue-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Đa dạng tuyến đường
              </h3>
              <p className="text-gray-600">
                Hơn 500 tuyến đường trên toàn quốc, kết nối mọi miền đất nước
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-md text-center"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Đặt vé nhanh chóng
              </h3>
              <p className="text-gray-600">
                Chỉ mất vài phút để hoàn tất đặt vé, tiết kiệm thời gian cho bạn
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-md text-center"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-orange-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Nhà xe uy tín
              </h3>
              <p className="text-gray-600">
                Hợp tác với hơn 100 nhà xe uy tín, đảm bảo chất lượng dịch vụ
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-md text-center"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-purple-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Thanh toán an toàn
              </h3>
              <p className="text-gray-600">
                Nhiều phương thức thanh toán an toàn, bảo mật thông tin khách
                hàng
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Sẵn sàng cho chuyến đi của bạn?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Đặt vé ngay hôm nay để nhận ưu đãi đặc biệt và bắt đầu hành trình
            của bạn một cách thuận lợi nhất.
          </p>
          <Link
            to="/routes"
            className="inline-block px-8 py-4 bg-white text-blue-700 font-semibold rounded-md hover:bg-blue-50 transition-colors duration-200"
          >
            Đặt vé ngay
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
