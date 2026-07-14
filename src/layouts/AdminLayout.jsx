import { useState } from 'react'
import Logo from '../components/common/Logo'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart2,
  Boxes, Settings, ChevronLeft, ChevronRight, Bell, LogOut,
  ExternalLink, Menu, X, Store,
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, logout } from '../features/auth/authSlice'
import { clearCartState } from '../features/cart/cartSlice'
import { clearWishlist } from '../features/wishlist/wishlistSlice'
import { ROUTES } from '../constants/routes'

const NAV_ITEMS = [
  { label: 'Overview', icon: LayoutDashboard, href: '/admin' },
  { label: 'Products', icon: Package, href: '/admin/products' },
  { label: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
  { label: 'Customers', icon: Users, href: '/admin/customers' },
  { label: 'Analytics', icon: BarChart2, href: '/admin/analytics' },
  { label: 'Inventory', icon: Boxes, href: '/admin/inventory' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
]

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCartState())
    dispatch(clearWishlist())
    navigate(ROUTES.HOME)
  }

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800 ${collapsed && !isMobile ? 'justify-center' : ''}`}>
        {collapsed && !isMobile ? (
          <img
            src="/Camela Logo.jpeg"
            alt="Camela Group"
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <Logo size="sm" />
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => (
          <NavLink
            key={href}
            to={href}
            end={href === '/admin'}
            onClick={() => isMobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              } ${collapsed && !isMobile ? 'justify-center' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} className="flex-shrink-0" />
                {(!collapsed || isMobile) && <span>{label}</span>}
                {collapsed && !isMobile && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                    {label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
        <NavLink
          to={ROUTES.HOME}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all"
        >
          <ExternalLink size={16} className="flex-shrink-0" />
          {(!collapsed || isMobile) && <span>View Store</span>}
        </NavLink>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-500 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all ${collapsed && !isMobile ? 'justify-center' : ''}`}
        >
          <LogOut size={16} className="flex-shrink-0" />
          {(!collapsed || isMobile) && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="relative hidden lg:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 overflow-hidden"
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-14 w-6 h-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors z-10 shadow-sm"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ duration: 0.25 }}
              className="fixed left-0 top-0 bottom-0 w-60 bg-white dark:bg-gray-900 z-50 lg:hidden border-r border-gray-100 dark:border-gray-800"
            >
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
              <Menu size={18} />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <Store size={13} className="text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Admin Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-600 rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-2">
              <img
          src={user?.avatar}
                alt="Admin"
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
          {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
