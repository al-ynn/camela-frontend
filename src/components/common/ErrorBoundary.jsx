import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, RefreshCw } from 'lucide-react'

const ErrorBoundary = ({ children }) => {
  const { t } = useTranslation()
  const [hasError, setHasError] = useState(false)

  const handleReset = () => setHasError(false)

  if (hasError) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-brand-600 dark:text-brand-400" size={28} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('error.title')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            {t('error.message')}
          </p>
          <button
            onClick={handleReset}
            className="btn-primary btn-md inline-flex items-center gap-2"
          >
            <RefreshCw size={16} />
            {t('error.tryAgain')}
          </button>
        </div>
      </div>
    )
  }

  return children
}

export default ErrorBoundary
