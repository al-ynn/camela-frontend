import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectTheme } from '../../features/ui/uiSlice'

const ThemeProvider = ({ children }) => {
  const theme = useSelector(selectTheme)

  useEffect(() => {
    const savedTheme = localStorage.getItem('camela-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const resolved = savedTheme || (prefersDark ? 'dark' : 'light')

    if (resolved === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return children
}

export default ThemeProvider
