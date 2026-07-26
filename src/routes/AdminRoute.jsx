import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectIsAdmin } from '../features/auth/authSlice'
import { ROUTES } from '../constants/routes'
import toast from 'react-hot-toast'

const AdminRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isAdmin = useSelector(selectIsAdmin)
  const location = useLocation()

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      toast.error('Access denied. Admin privileges required.')
    }
  }, [isAuthenticated, isAdmin])

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  if (!isAdmin) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return children
}

export default AdminRoute
