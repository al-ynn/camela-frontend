import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AvatarImage from '../components/common/AvatarImage'
import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  User,
  Settings,
  CreditCard,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../constants/routes'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview', href: ROUTES.DASHBOARD, exact: true },
  { icon: Package, label: 'My Orders', href: ROUTES.DASHBOARD_ORDERS },
  { icon: Heart, label: 'Wishlist', href: ROUTES.DASHBOARD_WISHLIST },
  { icon: MapPin, label: 'Addresses', href: ROUTES.DASHBOARD_ADDRESSES },
  { icon: User, label: 'Profile', href: ROUTES.DASHBOARD_PROFILE },
  { icon: Settings, label: 'Settings', href: ROUTES.DASHBOARD_SETTINGS },
]

const DashboardLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const verified = !!user?.email_verified_at
  const hideVerificationBanner = location.pathname === ROUTES.DASHBOARD_PROFILE

  useEffect(() => {
    setBannerDismissed(localStorage.getItem('dashboard-verification-banner-dismissed') === '1')
  }, [])

  const handleVerifyNow = () => {
    navigate(ROUTES.DASHBOARD_PROFILE, { state: { focusVerification: true } })
  }

  const handleDismissBanner = () => {
    setBannerDismissed(true)
    localStorage.setItem('dashboard-verification-banner-dismissed', '1')
  }

  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-surface-dark">
      <div className="container py-8">
        {!verified && !bannerDismissed && !hideVerificationBanner && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
            <div className="flex items-start justify-between gap-4 flex-col sm:flex-row sm:items-center">
              <div>
                <h3 className="font-semibold">Verify your email address</h3>
                <p className="mt-1 text-sm text-amber-800/90 dark:text-amber-100/80">
                  To protect your account and enable secure purchasing, please verify your email address before placing an order.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleVerifyNow} className="btn-brand btn-sm">
                  Verify Now
                </button>
                <button onClick={handleDismissBanner} className="btn-outline btn-sm">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="card p-6 sticky top-24">
              {/* User info */}
              <div className="flex items-center gap-4 pb-5 mb-5 border-b border-gray-100 dark:border-gray-800">
                <AvatarImage
                  src={user?.avatar}
                  name={user?.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-100 dark:ring-brand-900"
                  fallbackClassName="w-12 h-12 text-sm"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
            {user?.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>

              {/* Nav */}
              <nav className="space-y-1">
                {NAV_ITEMS.map(({ icon: Icon, label, href, exact }) => (
                  <NavLink
                    key={href}
                    to={href}
                    end={exact}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                        isActive
                          ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      }`
                    }
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={16} />
                      {label}
                    </span>
                    <ChevronRight size={13} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </NavLink>
                ))}
              </nav>

              {/* Logout */}
              <button
                onClick={logout}
                className="flex items-center gap-3 w-full px-3 py-2.5 mt-4 rounded-xl text-sm font-medium text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0">
            {/* Mobile nav */}
            <div className="lg:hidden overflow-x-auto no-scrollbar mb-6">
              <div className="flex gap-2 pb-1">
                {NAV_ITEMS.slice(0, 5).map(({ icon: Icon, label, href, exact }) => (
                  <NavLink
                    key={href}
                    to={href}
                    end={exact}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                        isActive
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                      }`
                    }
                  >
                    <Icon size={14} />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
