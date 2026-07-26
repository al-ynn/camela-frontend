import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      <Link
        to="/"
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
      >
        <Home size={14} />
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1.5">
          <ChevronRight size={13} className="text-gray-300 dark:text-gray-600" />
          {item.href && index < items.length - 1 ? (
            <Link
              to={item.href}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-200 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-600 dark:text-gray-300 font-medium truncate max-w-[200px]">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}

export default Breadcrumb
