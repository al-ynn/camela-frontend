import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/helpers'

const AccordionItem = ({ item, isOpen, onToggle }) => (
  <div className="border-b border-gray-100 dark:border-gray-800 last:border-0">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full py-4 text-left group"
    >
      <span
        className={cn(
          'text-sm font-medium transition-colors',
          isOpen
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
        )}
      >
        {item.title}
      </span>
      <ChevronDown
        size={16}
        className={cn(
          'text-gray-400 transition-transform duration-200 flex-shrink-0 ml-4',
          isOpen && 'rotate-180'
        )}
      />
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {item.content}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)

const Accordion = ({ items = [], allowMultiple = false, defaultOpen = [] }) => {
  const [openItems, setOpenItems] = useState(new Set(defaultOpen))

  const toggle = (id) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (!allowMultiple) next.clear()
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="w-full">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          item={item}
          isOpen={openItems.has(item.id)}
          onToggle={() => toggle(item.id)}
        />
      ))}
    </div>
  )
}

export default Accordion
