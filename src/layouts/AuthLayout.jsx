import { Outlet, Link, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { selectIsAuthenticated } from '../features/auth/authSlice'
import { ROUTES } from '../constants/routes'
import ScrollToTop from '../components/common/ScrollToTop'
import Logo from '../components/common/Logo'

const AuthLayout = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return (
    <div className="min-h-screen flex">
      <ScrollToTop />

      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-950 items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1576671081837-49000212a370?w=1200&q=90"
          alt="Camela Group"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/95 via-gray-900/85 to-amber-950/60" />
        {/* Subtle amber glow accent */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-amber-600/10 to-transparent" />
        <div className="relative z-10 px-14 text-center max-w-md">
          {/* Logo */}
          <Link to="/" className="flex justify-center mb-12">
            <Logo size="xl" nameClass="text-white" subClass="text-brand-400" />
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-serif font-bold text-white mb-4 leading-tight">
              Health for Life,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-200">
                Love &amp; Guard
              </span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Natural health products grounded in science — safe, effective nutritional solutions for every family.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white dark:bg-gray-950">
        {/* Mobile logo */}
        <Link to="/" className="flex mb-8 lg:hidden">
          <Logo size="md" />
        </Link>
        <div className="w-full max-w-md">
          <Outlet />
        </div>
        <p className="mt-8 text-xs text-gray-400 text-center">
          © {new Date().getFullYear()} Camela Group. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default AuthLayout
