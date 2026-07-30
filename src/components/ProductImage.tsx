import { useState } from 'react'
import type { MenuItem } from '../data/menu'

interface ProductImageProps {
  item: MenuItem
  className?: string
  /** object-cover | object-contain */
  fit?: 'cover' | 'contain'
  sizes?: string
  priority?: boolean
}

/**
 * Muestra la foto del producto. Si el archivo no existe o falla,
 * muestra un placeholder con el nombre para no romper el layout.
 */
export function ProductImage({
  item,
  className = '',
  fit = 'cover',
  sizes = '(max-width: 640px) 100vw, 480px',
  priority = false,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed || !item.image) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-ocean-900 to-ocean-700 p-4 text-center ${className}`}
        role="img"
        aria-label={item.name}
      >
        <span className="font-display text-2xl leading-none tracking-wide text-foam/90 sm:text-3xl">
          {item.name.split(' ').slice(0, 2).join(' ')}
        </span>
      </div>
    )
  }

  return (
    <img
      src={item.image}
      alt={item.name}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className={`${fit === 'cover' ? 'object-cover object-center' : 'object-contain object-center'} ${className}`}
    />
  )
}
