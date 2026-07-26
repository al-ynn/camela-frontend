import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setTheme, selectTheme } from '../features/ui/uiSlice'

export const useTheme = () => {
  const dispatch = useDispatch()
  const theme = useSelector(selectTheme)

  useEffect(() => {
    const savedTheme = localStorage.getItem('camela-theme')
    if (savedTheme) {
      dispatch(setTheme(savedTheme))
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      dispatch(setTheme(prefersDark ? 'dark' : 'light'))
    }
  }, [dispatch])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    dispatch(setTheme(newTheme))
  }

  return { theme, toggleTheme, isDark: theme === 'dark' }
}
