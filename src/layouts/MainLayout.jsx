import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import MobileMenu from '../components/layout/MobileMenu'
import SearchBar from '../components/layout/SearchBar'
import ScrollToTop from '../components/common/ScrollToTop'
import ErrorBoundary from '../components/common/ErrorBoundary'

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Header />
      <MobileMenu />
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
