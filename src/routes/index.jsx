import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import AdminLayout from '../layouts/AdminLayout'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import { PageSpinner } from '../components/ui/Spinner'

const Home = lazy(() => import('../pages/Home'))
const Shop = lazy(() => import('../pages/Shop'))
const ProductDetail = lazy(() => import('../pages/Product'))
const Cart = lazy(() => import('../pages/Cart'))
const Wishlist = lazy(() => import('../pages/Wishlist'))
const Search = lazy(() => import('../pages/Search'))
const HelpCenter = lazy(() => import('../pages/HelpCenter'))
const ContactUs = lazy(() => import('../pages/ContactUs'))
const ReturnsPolicy = lazy(() => import('../pages/ReturnsPolicy'))
const OrderStatus = lazy(() => import('../pages/OrderStatus'))
const ProductSafety = lazy(() => import('../pages/ProductSafety'))
const Checkout = lazy(() => import('../pages/Checkout'))
const OrderConfirmation = lazy(() => import('../pages/Checkout/OrderConfirmation'))

const Login = lazy(() => import('../pages/Auth/Login'))
const Register = lazy(() => import('../pages/Auth/Register'))
const ForgotPassword = lazy(() => import('../pages/Auth/ForgotPassword'))
const EmailVerified = lazy(() => import('../pages/EmailVerified'))

const DashboardHome = lazy(() => import('../pages/Dashboard'))
const DashboardProfile = lazy(() => import('../pages/Dashboard/Profile'))
const DashboardOrders = lazy(() => import('../pages/Dashboard/Orders'))
const DashboardAddresses = lazy(() => import('../pages/Dashboard/Addresses'))
const DashboardSettings = lazy(() => import('../pages/Dashboard/Settings'))
const DashboardWishlist = lazy(() => import('../pages/Dashboard/DashboardWishlist'))

const About = lazy(() => import('../pages/About'))
const MolecularHydrogen = lazy(() => import('../pages/MolecularHydrogen'))
const Peptide = lazy(() => import('../pages/Peptide'))
const TermsOfService = lazy(() => import('../pages/TermsOfService'))
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'))
const CookiePolicy = lazy(() => import('../pages/CookiePolicy'))
const Accessibility = lazy(() => import('../pages/Accessibility'))
const Apply = lazy(() => import('../pages/Apply'))
const NotFound = lazy(() => import('../pages/NotFound'))

const AdminOverview = lazy(() => import('../pages/Admin'))
const AdminProducts = lazy(() => import('../pages/Admin/Products'))
const AdminOrders = lazy(() => import('../pages/Admin/AdminOrders'))
const AdminCustomers = lazy(() => import('../pages/Admin/Customers'))
const AdminInventory = lazy(() => import('../pages/Admin/Inventory'))
const AdminSettings = lazy(() => import('../pages/Admin/AdminSettings'))

const AppRoutes = () => (
  <Suspense fallback={<PageSpinner />}>
    <Routes>
      {/* Main layout */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="shop/:category" element={<Shop />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="search" element={<Search />} />
        <Route path="help-center" element={<HelpCenter />} />
        <Route path="contact-us" element={<ContactUs />} />
        <Route path="returns-policy" element={<ReturnsPolicy />} />
        <Route path="order-status" element={<OrderStatus />} />
        <Route path="product-safety" element={<ProductSafety />} />
        <Route path="about" element={<About />} />
        <Route path="molecular-hydrogen" element={<MolecularHydrogen />} />
        <Route path="peptide" element={<Peptide />} />
        <Route path="terms-of-service" element={<TermsOfService />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="cookie-policy" element={<CookiePolicy />} />
        <Route path="accessibility" element={<Accessibility />} />
        <Route path="apply/:type" element={<Apply />} />

        {/* Protected main routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-confirmation/:id" element={<OrderConfirmation />} />
        </Route>

        {/* Dashboard — nested under MainLayout for header/footer, but uses DashboardLayout inside */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<DashboardProfile />} />
          <Route path="orders" element={<DashboardOrders />} />
          <Route path="wishlist" element={<DashboardWishlist />} />
          <Route path="addresses" element={<DashboardAddresses />} />
          <Route path="settings" element={<DashboardSettings />} />
        </Route>
      </Route>

      {/* Auth layout */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="email-verified" element={<EmailVerified />} />
      </Route>

      {/* Admin — standalone layout, no header/footer */}
      <Route
        path="admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
)

export default AppRoutes
