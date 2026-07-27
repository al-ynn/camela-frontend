import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from 'react-hot-toast'
import { ShieldAlert } from 'lucide-react'
import { store, persistor } from './store'
import AppRoutes from './routes'
import ErrorBoundary from './components/common/ErrorBoundary'
import { FullPageSpinner } from './components/ui/Spinner'
import ThemeProvider from './components/common/ThemeProvider'
import { authService } from './services/authApi'
import { commerceService } from './services/commerceApi'
import { clearAuthSession, updateUser } from './features/auth/authSlice'

const AuthSessionValidator = () => {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)

  useEffect(() => {
    let active = true

    const validateToken = async () => {
      if (!token) return

      try {
        const user = await authService.getProfile(token)
        dispatch(updateUser(user))
      } catch (error) {
        if (!active) return

        if (error.response?.status === 401) {
          dispatch(clearAuthSession())
        }
      }
    }

    validateToken()

    return () => {
      active = false
    }
  }, [dispatch, token])

  return null
}

const MaintenanceGate = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const isAdmin = useSelector((state) => state.auth.user?.is_admin === true)

  useEffect(() => {
    let active = true

    const loadStatus = async () => {
      try {
        const status = await commerceService.getPublicStoreStatus()
        if (!active) return
        setMaintenanceMode(!!status.maintenance_mode)
      } catch {
        if (!active) return
        setMaintenanceMode(false)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadStatus()

    return () => {
      active = false
    }
  }, [])

  if (loading) return <FullPageSpinner />

  if (maintenanceMode && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-surface-secondary dark:bg-surface-dark">
        <div className="max-w-xl w-full card p-8 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-300">
            <ShieldAlert size={28} />
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Website Under Maintenance
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The website is temporarily unavailable right now. Please check back soon.
          </p>
        </div>
      </div>
    )
  }

  return children
}

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<FullPageSpinner />} persistor={persistor}>
        <BrowserRouter>
          <ThemeProvider>
            <ErrorBoundary>
              <AuthSessionValidator />
              <MaintenanceGate>
                <AppRoutes />
              </MaintenanceGate>
              <Toaster
                position="bottom-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    borderRadius: '14px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 10px 40px -8px rgba(0,0,0,0.18)',
                  },
                  success: {
                    iconTheme: { primary: '#16a34a', secondary: '#fff' },
                  },
                  error: {
                    iconTheme: { primary: '#e11d48', secondary: '#fff' },
                  },
                }}
              />
            </ErrorBoundary>
          </ThemeProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )

}

export default App
