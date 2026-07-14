import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../common/Logo'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, Heart, ShoppingBag, LogIn } from 'lucide-react'
import { closeMobileMenu, selectMobileMenuOpen } from '../../features/ui/uiSlice'
import { selectIsAuthenticated, selectUser } from '../../features/auth/authSlice'
import { selectCartCount } from '../../features/cart/cartSlice'
import { selectWishlistCount } from '../../features/wishlist/wishlistSlice'
import { ROUTES } from '../../constants/routes'
import { useGetCategoriesQuery } from '../../services/productsApi'

const MobileMenu = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isOpen = useSelector(selectMobileMenuOpen)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)
  const cartCount = useSelector(selectCartCount)
  const wishlistCount = useSelector(selectWishlistCount)
  const { data: categories = [] } = useGetCategoriesQuery()

  const close = () => dispatch(closeMobileMenu())

  const goTo = (href) => {
    dispatch(closeMobileMenu())
    setTimeout(() => navigate(href), 10)
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.28 }}
            className="absolute left-0 top-0 bottom-0 w-[300px] bg-white dark:bg-gray-900 overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <Link to="/" onClick={close}>
                <Logo size="sm" />
              </Link>
              <button
                onClick={close}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* User section */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 dark:bg-gray-800/50">
                <img src={user?.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
            ) : (
              <div className="px-5 py-4 flex gap-3">
                <button onClick={() => goTo(ROUTES.LOGIN)} className="btn-primary btn-sm flex-1 justify-center">
                  <LogIn size={14} /> Sign In
                </button>
                <button onClick={() => goTo(ROUTES.REGISTER)} className="btn-outline btn-sm flex-1 justify-center">
                  Register
                </button>
              </div>
            )}

            {/* Quick links */}
            <div className="flex gap-2 px-5 py-3">
              <button
                onClick={() => goTo(ROUTES.CART)}
                className="flex items-center gap-2 flex-1 px-3 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 min-h-[44px]"
              >
                <ShoppingBag size={15} />
                Cart
                {cartCount > 0 && (
                  <span className="ml-auto bg-brand-600 text-white text-xs rounded-full px-1.5 py-0.5">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => goTo(ROUTES.WISHLIST)}
                className="flex items-center gap-2 flex-1 px-3 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 min-h-[44px]"
              >
                <Heart size={15} />
                Saved
                {wishlistCount > 0 && (
                  <span className="ml-auto bg-brand-600 text-white text-xs rounded-full px-1.5 py-0.5">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </div>

            {/* Navigation */}
            <nav className="px-5 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                Navigation
              </p>
              {[
                { label: 'Home', href: ROUTES.HOME },
                { label: 'Shop All', href: ROUTES.SHOP },
                { label: 'About Us', href: ROUTES.ABOUT },
              ].map((item) => (
                <button
                  key={item.href}
                  onClick={() => goTo(item.href)}
                  className="flex items-center justify-between w-full px-3 py-3.5 rounded-xl text-sm font-medium mb-1 transition-colors min-h-[48px] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700"
                >
                  {item.label}
                  <ChevronRight size={14} className="text-gray-300" />
                </button>
              ))}
            </nav>

            {/* Categories */}
            <nav className="px-5 py-3 border-t border-gray-100 dark:border-gray-800">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                Categories
              </p>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    goTo(cat.landing_page)
                  }}
                  className="flex items-center justify-between w-full px-3 py-3.5 rounded-xl text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 mb-1 transition-colors min-h-[48px]"
                >
                  {cat.name}
                  <ChevronRight size={14} className="text-gray-300" />
                </button>
              ))}
            </nav>

            {/* Dashboard links if authenticated */}
            {isAuthenticated && (
              <nav className="px-5 py-3 border-t border-gray-100 dark:border-gray-800">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                  Account
                </p>
                {[
                  { label: 'Dashboard', href: ROUTES.DASHBOARD },
                  { label: 'My Orders', href: ROUTES.DASHBOARD_ORDERS },
                  { label: 'Profile', href: ROUTES.DASHBOARD_PROFILE },
                ].map((item) => (
                  <button
                    key={item.href}
                    onClick={() => goTo(item.href)}
                    className="flex items-center justify-between w-full px-3 py-3.5 rounded-xl text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 mb-1 transition-colors min-h-[48px]"
                  >
                    {item.label}
                    <ChevronRight size={14} className="text-gray-300" />
                  </button>
                ))}
              </nav>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default MobileMenu
