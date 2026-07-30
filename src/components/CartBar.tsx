import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { formatPrice } from '../data/menu'
import { useCart } from '../context/CartContext'

interface CartBarProps {
  onOpen: () => void
}

export function CartBar({ onOpen }: CartBarProps) {
  const { itemCount, total } = useCart()

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <button
            type="button"
            onClick={onOpen}
            className="pointer-events-auto mx-auto flex w-full max-w-md items-center justify-between gap-3 rounded-2xl bg-coral px-5 py-4 text-left text-white shadow-xl shadow-coral/35 transition hover:bg-coral-dark"
          >
            <span className="flex items-center gap-3">
              <span className="relative flex size-10 items-center justify-center rounded-xl bg-white/20">
                <ShoppingBag className="size-5" />
                <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-lime-sea text-[11px] font-bold text-ocean-950">
                  {itemCount}
                </span>
              </span>
              <span>
                <span className="block text-sm font-semibold">Ver pedido</span>
                <span className="block text-xs text-white/80">
                  Listo para WhatsApp
                </span>
              </span>
            </span>
            <span className="text-lg font-bold tabular-nums">
              {formatPrice(total)}
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
