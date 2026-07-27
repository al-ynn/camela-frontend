import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import MobileMenu from '../components/layout/MobileMenu'
import CartDrawer from '../components/layout/CartDrawer'
import SearchBar from '../components/layout/SearchBar'
import ScrollToTop from '../components/common/ScrollToTop'
import ErrorBoundary from '../components/common/ErrorBoundary'
import { closeCartDrawer, closeMobileMenu, closeSearch } from '../features/ui/uiSlice'

const MainLayout = () => {
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    dispatch(closeCartDrawer())
    dispatch(closeMobileMenu())
    dispatch(closeSearch())
  }, [dispatch, location.pathname])

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Header />
      <MobileMenu />
      <CartDrawer />
      <SearchBar />
      <main className="flex-1">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
