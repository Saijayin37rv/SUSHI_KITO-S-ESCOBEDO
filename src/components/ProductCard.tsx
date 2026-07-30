import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import type { MenuItem } from '../data/menu'
import { formatPriceLabel } from '../data/menu'
import { ProductImage } from './ProductImage'

interface ProductCardProps {
  item: MenuItem
  index: number
  isPopular?: boolean
  onOpen: (item: MenuItem) => void
}

export function ProductCard({
  item,
  index,
  isPopular = false,
  onOpen,
}: ProductCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.24) }}
      className="border-b border-ocean-900/8 py-4"
    >
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="group flex w-full gap-3.5 text-left sm:gap-4"
      >
        <div className="relative size-[5.25rem] shrink-0 overflow-hidden rounded-2xl bg-ocean-950 shadow-sm ring-1 ring-ocean-900/8 transition group-active:scale-[0.98] sm:size-28">
          <ProductImage
            item={item}
            fit="cover"
            className="size-full"
            sizes="112px"
          />
          {item.sizes?.length ? (
            <span className="absolute bottom-1.5 left-1.5 rounded bg-ocean-950/75 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase backdrop-blur-sm">
              Chico · Grande
            </span>
          ) : item.options?.length ? (
            <span className="absolute bottom-1.5 left-1.5 rounded bg-ocean-950/75 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase backdrop-blur-sm">
              Elige
            </span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1 py-0.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-snug text-ocean-950 text-[0.95rem] sm:text-base">
              {item.name}
            </h3>
            <ChevronRight className="mt-0.5 size-4 shrink-0 text-ocean-900/30 transition group-hover:text-ocean-700" />
          </div>

          {isPopular && (
            <div className="mt-1">
              <span className="rounded bg-lime-sea/80 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-ocean-950 uppercase">
                Popular
              </span>
            </div>
          )}

          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ocean-900/60">
            {item.description}
          </p>

          <p className="mt-2 font-semibold text-ocean-700">
            {formatPriceLabel(item)}
          </p>
        </div>
      </button>
    </motion.article>
  )
}
