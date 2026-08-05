import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '../../services/authApi'
import { selectAuth, updateUser } from '../../features/auth/authSlice'
import { ROUTES } from '../../constants/routes'

const EmailVerified = () => {
  const dispatch = useDispatch()
  const token = useSelector(selectAuth).token
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const refreshUser = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const data = await authService.getProfile(token)
        dispatch(updateUser(data))
        toast.success('Email verified successfully.')
      } catch {
        toast.success('Email verified successfully.')
      } finally {
        setLoading(false)
      }
    }

    refreshUser()
  }, [dispatch, token])

  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-surface-dark flex items-center justify-center px-4">
      <div className="card p-8 text-center max-w-md w-full">
        <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
          Email verified successfully.
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
          {loading ? 'Refreshing your account status...' : 'You can now continue shopping and checkout securely.'}
        </p>
        <div className="mt-6">
          <Link to={ROUTES.HOME} className="btn-brand btn-md inline-flex justify-center">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EmailVerified
