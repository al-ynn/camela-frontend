import { useEffect, useState } from 'react'
import { BrowserRouter, Link, useLocation } from 'react-router-dom'
import { Provider } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from 'react-hot-toast'
import { ShieldAlert, LogIn, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { store, persistor } from './store'
import AppRoutes from './routes'
import ErrorBoundary from './components/common/ErrorBoundary'
import { FullPageSpinner } from './components/ui/Spinner'
import ThemeProvider from './components/common/ThemeProvider'
import { authService } from './services/authApi'
import { commerceService } from './services/commerceApi'
import { clearAuthSession, updateUser } from './features/auth/authSlice'
import { useAuth } from './hooks/useAuth'
import { useForm } from 'react-hook-form'
import Logo from './components/common/Logo'

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
  const location = useLocation()
  const { login, loading: authLoading } = useAuth()
  const { register, handleSubmit } = useForm()
  const [showAdminPassword, setShowAdminPassword] = useState(false)

  const resolveMaintenanceFlag = (status) => {
    const value =
      status?.maintenance_mode ??
      status?.maintenanceMode ??
      status?.data?.maintenance_mode ??
      status?.data?.maintenanceMode ??
      status?.store_status?.maintenance_mode ??
      status?.storeStatus?.maintenance_mode

    return Boolean(Number(value ?? 0))
  }

  useEffect(() => {
    let active = true

    const loadStatus = async () => {
      try {
        const status = await commerceService.getPublicStoreStatus()
        if (!active) return
        setMaintenanceMode(resolveMaintenanceFlag(status))
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

  const allowAuthPages =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/email-verified'

  if (allowAuthPages) {
    return children
  }

  if (maintenanceMode && !isAdmin) {
    return (
      <div className="min-h-screen flex bg-white dark:bg-gray-950">
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-950 items-center justify-center px-14">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-amber-950/70" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.35),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.18),_transparent_30%)]" />
          <div className="relative z-10 max-w-md text-center">
            <Link to="/" className="inline-flex mb-10">
              <Logo size="xl" nameClass="text-white" subClass="text-brand-400" />
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              <span className="text-brand-300 text-xs font-semibold uppercase tracking-widest">Protected access</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-white mb-4 leading-tight">
              Website Under Maintenance
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed">
              Customers stay on pause while admins can sign in and continue managing the store.
            </p>
            <div className="grid grid-cols-3 gap-3 mt-10">
              {[
                { label: 'Admins', value: 'Allowed' },
                { label: 'Customers', value: 'Paused' },
                { label: 'Access', value: 'Secure' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-lg font-semibold text-white">{item.value}</p>
                  <p className="text-[11px] uppercase tracking-widest text-gray-400 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 bg-surface-secondary dark:bg-surface-dark">
          <div className="w-full max-w-md mx-auto">
            <div className="lg:hidden flex justify-center mb-8">
              <Logo size="md" />
            </div>
            <div className="card p-8 md:p-10 border border-gray-100 dark:border-gray-800 shadow-premium">
              <div className="flex items-start gap-3 mb-6 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10 px-4 py-3">
                <ShieldAlert size={18} className="mt-0.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">Website under maintenance</p>
                  <p className="text-xs text-amber-700/80 dark:text-amber-300/80">Customers cannot continue. Admins can sign in below.</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300">
                  <ShieldCheck size={12} />
                  Admin access only
                </div>
                <h2 className="mt-4 text-2xl font-display font-bold text-gray-900 dark:text-white">Admin Login</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-6">
                  Sign in with an admin account to access the website during maintenance.
                </p>
              </div>

              <form
                className="space-y-4"
                onSubmit={handleSubmit(async (values) => {
                  await login(values)
                })}
              >
                <div>
                  <label className="label-base">Email</label>
                  <input
                    {...register('email')}
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="label-base">Password</label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showAdminPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="input-base pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      {showAdminPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={authLoading} className="btn-brand btn-lg w-full justify-center gap-2">
                  <LogIn size={17} />
                  {authLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <p className="mt-5 text-xs text-gray-400 leading-6">
                If you are a customer, please wait until maintenance is complete.
              </p>
            </div>
          </div>
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
