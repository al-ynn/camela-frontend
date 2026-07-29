import { useEffect, useState } from 'react'
import Logo from '../components/common/Logo'
import AvatarImage from '../components/common/AvatarImage'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  Boxes, Settings, ChevronLeft, ChevronRight, Bell, LogOut,
  ExternalLink, Menu, X, Store, BellRing,
  MailOpen, Mail, Clock3, TriangleAlert, ShoppingCart, UserPlus, PackageCheck,
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, logout } from '../features/auth/authSlice'
import { clearCartState } from '../features/cart/cartSlice'
import { clearWishlist } from '../features/wishlist/wishlistSlice'
import { ROUTES } from '../constants/routes'
import { commerceService } from '../services/commerceApi'

const NAV_ITEMS = [
  { label: 'Overview', icon: LayoutDashboard, href: '/admin' },
  { label: 'Products', icon: Package, href: '/admin/products' },
  { label: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
  { label: 'Customers', icon: Users, href: '/admin/customers' },
  { label: 'Inventory', icon: Boxes, href: '/admin/inventory' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
]

const NOTIFICATION_ICON_MAP = {
  new_order: ShoppingCart,
  low_stock: TriangleAlert,
  new_customer: UserPlus,
  order_delivered: PackageCheck,
}

const getNotificationArray = (payload) => payload?.items?.data ?? []

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notificationItems, setNotificationItems] = useState([])
  const [notificationMeta, setNotificationMeta] = useState({ unreadCount: 0 })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const token = useSelector((state) => state.auth.token)

  useEffect(() => {
    let active = true

    const loadNotifications = async () => {
      if (!token) return
      try {
        const data = await commerceService.getAdminNotifications(token)
        if (!active) return

        setNotificationItems(getNotificationArray(data))
        setNotificationMeta({
          unreadCount: data?.unread_count ?? 0,
        })
      } catch {
        if (active) {
          setNotificationItems([])
          setNotificationMeta({ unreadCount: 0 })
        }
      }
    }

    loadNotifications()
    return () => { active = false }
  }, [token, notificationOpen])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest('[data-admin-notifications]')) {
        setNotificationOpen(false)
      }
    }

    if (notificationOpen) {
      document.addEventListener('pointerdown', handleOutsideClick)
    }

    return () => document.removeEventListener('pointerdown', handleOutsideClick)
  }, [notificationOpen])

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCartState())
    dispatch(clearWishlist())
    navigate(ROUTES.HOME)
  }

  const SidebarContent = ({ isMobile = false, showHeader = true }) => (
    <div className="flex flex-col h-full">
      {showHeader && (
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
      )}

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
            {() => (
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
      <motion.aside
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="relative hidden lg:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 overflow-hidden"
      >
        <div className={`relative flex items-center ${collapsed ? 'justify-center' : 'justify-start'} h-[73px] px-4 border-b border-gray-100 dark:border-gray-800`}>
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            {collapsed ? (
              <img
                src="/Camela Logo.jpeg"
                alt="Camela Group"
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <Logo size="sm" />
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-12 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors z-10 shadow-sm"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
          >
            {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </div>
        <SidebarContent showHeader={false} />
      </motion.aside>

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

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
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

          <div className="flex items-center gap-2 relative" data-admin-notifications>
            <button
              type="button"
              onClick={() => setNotificationOpen((v) => !v)}
              className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
              aria-label="Admin notifications"
              aria-expanded={notificationOpen}
            >
              <Bell size={17} />
              {notificationMeta.unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-brand-600 text-white text-[10px] leading-4 text-center font-semibold">
                  {notificationMeta.unreadCount > 9 ? '9+' : notificationMeta.unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notificationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-12 w-[360px] max-w-[calc(100vw-1rem)] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-premium overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                        <BellRing size={15} /> Notifications
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">Live admin alerts</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={async () => {
                          if (!token || !notificationItems.length) return
                          await commerceService.markAllAdminNotificationsRead(token)
                          const refreshed = await commerceService.getAdminNotifications(token)
                          setNotificationItems(getNotificationArray(refreshed))
                          setNotificationMeta({ unreadCount: refreshed?.unread_count ?? 0 })
                        }}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Mark all read
                      </button>
                      <button type="button" onClick={() => setNotificationOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 max-h-[420px] overflow-y-auto space-y-2">
                    {notificationItems.length ? notificationItems.map((item) => {
                      const Icon = NOTIFICATION_ICON_MAP[item.type] ?? Bell
                      const unread = !item.read_at
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={async () => {
                            if (!token) return
                            if (unread) {
                              await commerceService.markAdminNotificationRead(token, item.id)
                            }
                            if (item.url) {
                              navigate(item.url)
                              setNotificationOpen(false)
                            } else {
                              const refreshed = await commerceService.getAdminNotifications(token)
                              setNotificationItems(getNotificationArray(refreshed))
                              setNotificationMeta({ unreadCount: refreshed?.unread_count ?? 0 })
                            }
                          }}
                          className={`w-full text-left flex items-start gap-3 rounded-xl p-3 border transition-colors ${unread ? 'border-brand-200 dark:border-brand-900/40 bg-brand-50 dark:bg-brand-900/10' : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40'}`}
                        >
                          <div className={`mt-0.5 w-9 h-9 rounded-full flex items-center justify-center ${unread ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                            <Icon size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</p>
                              {unread && <span className="mt-1 inline-flex w-2.5 h-2.5 rounded-full bg-brand-500" />}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{item.message}</p>
                            <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-gray-400">
                              <span className="inline-flex items-center gap-1">
                                {unread ? <Mail size={12} /> : <MailOpen size={12} />}
                                {unread ? 'Unread' : 'Read'}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Clock3 size={12} />
                                {item.created_at}
                              </span>
                            </div>
                          </div>
                        </button>
                      )
                    }) : (
                      <div className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                        No notifications yet.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2 pl-2">
              <AvatarImage
                src={user?.avatar}
                name={user?.name}
                alt="Admin"
                className="w-7 h-7 rounded-full object-cover"
                fallbackClassName="w-7 h-7 text-[10px]"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
