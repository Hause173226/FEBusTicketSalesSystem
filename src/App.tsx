
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import { TokenGuard } from './components/TokenGuard';
import HomePage from './pages/HomePage';
import RoutesPage from './pages/RoutesPage';
import PaymentPage from './pages/PaymentPage';
import TicketPage from './pages/TicketPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import SearchResultsPage from './pages/SearchResultsPage';
import BookingsPage from './pages/BookingsPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailedPage from './pages/PaymentFailedPage';
import VNPayReturnPage from './hooks/VNPayReturnPage';
import BookingDetailPage from './pages/BookingDetailPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import PaymentDetailsPage from './hooks/PaymentDetailsPage';
import VNPayPaymentPage from './hooks/VNPayPaymentPage';

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <TokenGuard>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="routes" element={<RoutesPage />} />
            <Route path="bookings/:id" element={<BookingsPage />} />
            <Route path="payment/:id" element={<PaymentPage />} />
            <Route path="payment/vnpay/:bookingId" element={<VNPayPaymentPage />} />
            <Route path="payment/vnpay-return" element={<VNPayReturnPage />} />
            <Route path="payment-success" element={<PaymentSuccessPage />} />
            <Route path="payment/failed" element={<PaymentFailedPage />} />
            <Route path="ticket/:bookingId" element={<TicketPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} /> 
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="search-results" element={<SearchResultsPage />} />
            <Route path="booking" element={<BookingsPage />} />
            <Route path="booking-confirmation/:bookingId" element={<BookingConfirmationPage />} />
            <Route path="booking-details/:orderId" element={<BookingDetailPage />} />
            <Route path="payment-details/:orderId" element={<PaymentDetailsPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </TokenGuard>
    </>
  );
}

export default App;