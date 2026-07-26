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
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              <span className="text-brand-300 text-xs font-semibold uppercase tracking-widest">Scientifically Proven</span>
            </div>

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

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-3 gap-4 mt-12"
          >
            {[
              { label: '50K+', desc: 'Customers' },
              { label: '100%', desc: 'All Natural' },
              { label: '99%', desc: 'Satisfaction' },
            ].map(({ label, desc }) => (
              <div key={desc} className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:border-brand-500/30 transition-colors">
                <p className="text-2xl font-display font-bold text-brand-400">{label}</p>
                <p className="text-xs text-gray-400 mt-1">{desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Certifications strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center gap-4 mt-10"
          >
            {['No Additives', 'Lab Tested', 'Family Safe'].map((badge) => (
              <span key={badge} className="flex items-center gap-1.5 text-xs text-gray-500">
                <svg className="w-3 h-3 text-brand-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-5.121-5.121a1 1 0 111.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {badge}
              </span>
            ))}
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
