import { motion } from 'framer-motion'
import { categories, type CategoryId } from '../data/menu'

interface CategoryTabsProps {
  active: CategoryId | 'todos'
  onChange: (id: CategoryId | 'todos') => void
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  const tabs: { id: CategoryId | 'todos'; label: string }[] = [
    { id: 'todos', label: 'Todo' },
    ...categories.map((c) => ({ id: c.id, label: c.label })),
  ]

  return (
    <div className="sticky top-0 z-30 border-b border-ocean-900/8 bg-sand/90 backdrop-blur-md">
      <div className="mx-auto max-w-2xl overflow-x-auto px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2">
          {tabs.map((tab) => {
            const isActive = active === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChange(tab.id)}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'text-white'
                    : 'bg-white/60 text-ocean-800 hover:bg-white'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="cat-pill"
                    className="absolute inset-0 rounded-full bg-ocean-800"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
