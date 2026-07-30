import { useMemo, useState } from 'react'
import {
  categories,
  menuItems,
  type CategoryId,
  type MenuItem,
} from './data/menu'
import { CartProvider } from './context/CartContext'
import { usePopularIds } from './hooks/usePopularIds'
import { Hero } from './components/Hero'
import { CategoryTabs } from './components/CategoryTabs'
import { ProductCard } from './components/ProductCard'
import { ProductDetail } from './components/ProductDetail'
import { CartBar } from './components/CartBar'
import { CartDrawer } from './components/CartDrawer'

function MenuApp() {
  const [active, setActive] = useState<CategoryId | 'todos'>('todos')
  const [cartOpen, setCartOpen] = useState(false)
  const [selected, setSelected] = useState<MenuItem | null>(null)
  const { isPopular } = usePopularIds()

  const grouped = useMemo(() => {
    const sortByPopular = (items: MenuItem[]) =>
      [...items].sort((a, b) => {
        const pa = isPopular(a.id) ? 0 : 1
        const pb = isPopular(b.id) ? 0 : 1
        return pa - pb
      })

    if (active === 'todos') {
      return categories
        .map((cat) => ({
          ...cat,
          items: sortByPopular(
            menuItems.filter((i) => i.category === cat.id),
          ),
        }))
        .filter((g) => g.items.length > 0)
    }
    const cat = categories.find((c) => c.id === active)!
    return [
      {
        ...cat,
        items: sortByPopular(
          menuItems.filter((i) => i.category === active),
        ),
      },
    ]
  }, [active, isPopular])

  return (
    <div className="pb-28">
      <Hero />

      <main id="menu" className="mx-auto max-w-2xl px-5 sm:px-8">
        <div className="pt-2 pb-4">
          <h2 className="font-display text-4xl tracking-wide text-ocean-900">
            Menú
          </h2>
          <p className="mt-1 text-sm text-ocean-900/55">
            Toca un platillo para ver la foto, elegir tamaño y agregarlo.
          </p>
        </div>
      </main>

      <CategoryTabs active={active} onChange={setActive} />

      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        {grouped.map((group) => (
          <section
            key={group.id}
            className="pt-6"
            aria-labelledby={`cat-${group.id}`}
          >
            <h3
              id={`cat-${group.id}`}
              className="font-display text-2xl tracking-wide text-ocean-800"
            >
              {group.label}
            </h3>
            <div>
              {group.items.map((item, index) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  index={index}
                  isPopular={isPopular(item.id)}
                  onOpen={setSelected}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="mx-auto mt-16 max-w-2xl border-t border-ocean-900/8 px-5 py-10 text-center sm:px-8">
        <p className="font-display text-3xl tracking-wide text-ocean-900">
          KITOS
        </p>
        <p className="mt-1 text-sm text-ocean-900/50">
          Mariscos frescos · Pedidos por WhatsApp
        </p>
      </footer>

      <CartBar onOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <ProductDetail
        item={selected}
        isPopular={selected ? isPopular(selected.id) : false}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}

export default function App() {
  return (
    <CartProvider>
      <MenuApp />
    </CartProvider>
  )
}
