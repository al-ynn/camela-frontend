import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Logo from '../common/Logo'
import AvatarImage from '../common/AvatarImage'
import LanguageSwitcher from '../common/LanguageSwitcher'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag,
  Heart,
  Search,
  Sun,
  Moon,
  Menu,
  User,
  ChevronDown,
  Package,
  LogOut,
  Settings,
  LayoutDashboard,
} from 'lucide-react'
import { selectCartCount } from '../../features/cart/cartSlice'
import { selectWishlistCount } from '../../features/wishlist/wishlistSlice'
import { selectIsAuthenticated, selectUser, selectIsAdmin, selectAuth, logout } from '../../features/auth/authSlice'
import {
  openMobileMenu,
  openSearch,
  toggleTheme,
  selectTheme,
} from '../../features/ui/uiSlice'
import { ROUTES } from '../../constants/routes'
import { clearCartState } from '../../features/cart/cartSlice'
import { clearWishlist } from '../../features/wishlist/wishlistSlice'
import { useGetCategoriesQuery } from '../../services/productsApi'
import { authService } from '../../services/authApi'

const Header = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cartCount = useSelector(selectCartCount)
  const wishlistCount = useSelector(selectWishlistCount)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)
  const isAdmin = useSelector(selectIsAdmin)
  const token = useSelector(selectAuth).token
  const theme = useSelector(selectTheme)
  const { data: categories = [] } = useGetCategoriesQuery()

  const NAV_LINKS = [
    { label: t('nav.home'), href: ROUTES.HOME },
    { label: t('nav.shop'), href: ROUTES.SHOP },
    { label: t('nav.about'), href: ROUTES.ABOUT },
    {
      label: t('nav.categories'),
      children: categories.map((category) => ({ label: category.name, href: category.landing_page })),
    },
  ]

  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    if (token) {
      try { await authService.logout(token) } catch { /* continue local cleanup */ }
    }
    dispatch(logout())
    dispatch(clearCartState())
    dispatch(clearWishlist())
    setUserMenuOpen(false)
    navigate(ROUTES.HOME)
  }

  return (
    <>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800'
            : 'bg-white dark:bg-gray-950'
        }`}
      >
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center flex-shrink-0">
            <Logo size="md" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    onMouseEnter={() => setCategoriesOpen(true)}
                    onMouseLeave={() => setCategoriesOpen(false)}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${categoriesOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {categoriesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        onMouseEnter={() => setCategoriesOpen(true)}
                        onMouseLeave={() => setCategoriesOpen(false)}
                        className="absolute top-full right-0 mt-1 w-52 bg-white dark:bg-gray-900 rounded-2xl shadow-premium border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            onClick={() => setCategoriesOpen(false)}
                            className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                        <Link
                          to={ROUTES.SHOP}
                          onClick={() => setCategoriesOpen(false)}
                          className="block px-4 py-3 text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-t border-gray-100 dark:border-gray-800"
                        >
                          {t('header.viewAllCategories')} →
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink
                  key={link.href}
                  to={link.href}
                  end={link.href === '/'}
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                      isActive
                        ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800'
                        : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              )
            )}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => dispatch(openSearch())}
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              aria-label="Search"
            >
              <Search size={19} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun size={19} />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon size={19} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Wishlist */}
            <Link
              to={ROUTES.WISHLIST}
              className="relative p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              aria-label="Wishlist"
            >
              <Heart size={19} />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center bg-brand-600 text-white text-[10px] font-bold rounded-full px-1"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to={ROUTES.CART}
              className="relative p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              aria-label="Cart"
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] min-h-[18px] flex items-center justify-center bg-brand-600 text-white text-[10px] font-bold rounded-full px-1"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  <AvatarImage
                    src={user?.avatar}
                    name={user?.name}
                    className="w-7 h-7 rounded-full object-cover"
                    fallbackClassName="w-7 h-7 text-[10px]"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:block">
                    {user?.name}
                  </span>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-900 rounded-2xl shadow-premium border border-gray-100 dark:border-gray-800 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                      </div>
                      {[
                        { icon: User, label: t('nav.dashboard'), href: ROUTES.DASHBOARD },
                        { icon: Package, label: t('dashboard.orders'), href: ROUTES.DASHBOARD_ORDERS },
                        { icon: Settings, label: t('dashboard.settings'), href: ROUTES.DASHBOARD_SETTINGS },
                        ...(isAdmin ? [{ icon: LayoutDashboard, label: t('nav.adminPanel'), href: ROUTES.ADMIN }] : []),
                      ].map(({ icon: Icon, label, href }) => (
                        <Link
                          key={href}
                          to={href}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Icon size={15} className="text-gray-400" />
                          {label}
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors w-full border-t border-gray-100 dark:border-gray-800"
                      >
                        <LogOut size={15} />
                        {t('nav.logout')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="hidden sm:flex btn-outline btn-sm gap-2"
              >
                <User size={15} />
                {t('nav.login')}
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => dispatch(openMobileMenu())}
              className="lg:hidden p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
