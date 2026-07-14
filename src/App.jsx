import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from 'react-hot-toast'
import { store, persistor } from './store'
import AppRoutes from './routes'
import ErrorBoundary from './components/common/ErrorBoundary'
import { FullPageSpinner } from './components/ui/Spinner'
import ThemeProvider from './components/common/ThemeProvider'

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<FullPageSpinner />} persistor={persistor}>
        <BrowserRouter>
          <ThemeProvider>
            <ErrorBoundary>
              <AppRoutes />
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
