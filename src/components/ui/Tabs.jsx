import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/helpers'

const Tabs = ({ tabs = [], defaultTab, className }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const activeContent = tabs.find((t) => t.id === activeTab)?.content

  return (
    <div className={cn('w-full', className)}>
      <div className="relative flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'relative px-5 py-3.5 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0',
              activeTab === tab.id
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            )}
          >
            {tab.label}
            {tab.badge && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-brand-600 text-white rounded-full">
                {tab.badge}
              </span>
            )}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="pt-6"
      >
        {activeContent}
      </motion.div>
    </div>
  )
}

export default Tabs
