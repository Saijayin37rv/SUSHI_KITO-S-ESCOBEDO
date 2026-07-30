import { useCallback, useEffect, useState } from 'react'
import { fetchPopularProductIds } from '../lib/sheets'

/**
 * Carga desde Google Sheets los productos más vendidos
 * para mostrar el badge "Popular" en el menú.
 */
export function usePopularIds() {
  const [popularIds, setPopularIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      const ids = await fetchPopularProductIds()
      if (!cancelled) {
        setPopularIds(new Set(ids))
        setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const isPopular = useCallback(
    (productId: string) => popularIds.has(productId),
    [popularIds],
  )

  return { popularIds, isPopular, loading }
}
