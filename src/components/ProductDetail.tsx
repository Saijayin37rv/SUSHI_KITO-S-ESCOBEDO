import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, X } from 'lucide-react'
import type { MenuItem, MenuOptionGroup } from '../data/menu'
import {
  areRequiredOptionsSelected,
  formatPrice,
  getUnitPrice,
  makeCartKey,
  normalizeCartExtras,
} from '../data/menu'
import { useCart } from '../context/CartContext'
import { ProductImage } from './ProductImage'

interface ProductDetailProps {
  item: MenuItem | null
  isPopular?: boolean
  onClose: () => void
}

function ChoiceButton({
  label,
  active,
  onClick,
  hint,
}: {
  label: string
  active: boolean
  onClick: () => void
  hint?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-3 py-3 text-left transition ${
        active
          ? 'border-ocean-800 bg-ocean-800 text-white'
          : 'border-ocean-900/10 bg-white text-ocean-900'
      }`}
    >
      <span className="block text-sm font-semibold leading-snug">{label}</span>
      {hint ? (
        <span
          className={`mt-0.5 block text-xs ${
            active ? 'text-foam/80' : 'text-ocean-900/50'
          }`}
        >
          {hint}
        </span>
      ) : null}
    </button>
  )
}

function OptionGroupPicker({
  group,
  value,
  onChange,
}: {
  group: MenuOptionGroup
  value?: string
  onChange: (choiceId: string) => void
}) {
  if (group.subgroups?.length) {
    return (
      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold tracking-wide text-ocean-900/50 uppercase">
          {group.label}
        </p>
        <div className="space-y-4">
          {group.subgroups.map((sub) => (
            <div key={sub.id}>
              <p className="mb-2 text-sm font-semibold text-ocean-800">
                {sub.label}
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {sub.choices.map((choice) => (
                  <ChoiceButton
                    key={choice.id}
                    label={choice.label}
                    active={value === choice.id}
                    onClick={() => onChange(choice.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!group.choices?.length) return null

  return (
    <div className="mt-5">
      <p className="mb-2 text-xs font-semibold tracking-wide text-ocean-900/50 uppercase">
        {group.label}
      </p>
      <div
        className={`grid gap-2 ${
          group.choices.length === 2
            ? 'grid-cols-2'
            : group.choices.length === 3
              ? 'grid-cols-1 sm:grid-cols-3'
              : 'grid-cols-2'
        }`}
      >
        {group.choices.map((choice) => (
          <ChoiceButton
            key={choice.id}
            label={choice.label}
            active={value === choice.id}
            onClick={() => onChange(choice.id)}
          />
        ))}
      </div>
    </div>
  )
}

export function ProductDetail({
  item,
  isPopular = false,
  onClose,
}: ProductDetailProps) {
  const { addItem, setQty, qtyFor } = useCart()
  const [sizeId, setSizeId] = useState<string | undefined>()
  const [selections, setSelections] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!item) return
    setSizeId(item.sizes?.[0]?.id)
    setSelections({})
  }, [item])

  useEffect(() => {
    if (!item) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [item])

  const open = Boolean(item)
  const needsSize = Boolean(item?.sizes?.length)
  const hasOptions = Boolean(item?.options?.length)

  const extras = useMemo(() => {
    if (!item) return undefined
    return normalizeCartExtras(item, {
      sizeId: needsSize ? sizeId : undefined,
      options: hasOptions ? selections : undefined,
    })
  }, [item, needsSize, sizeId, hasOptions, selections])

  const unitPrice = item ? getUnitPrice(item, extras?.sizeId) : 0
  const optionsReady = item
    ? areRequiredOptionsSelected(item, selections)
    : false
  const canAdd =
    Boolean(item) &&
    (!needsSize || Boolean(sizeId)) &&
    (!hasOptions || optionsReady)
  const qty = item && canAdd ? qtyFor(item.id, extras) : 0

  function handleAdd() {
    if (!item || !canAdd) return
    addItem(item, extras)
  }

  function setOption(groupId: string, choiceId: string) {
    setSelections((prev) => ({ ...prev, [groupId]: choiceId }))
  }

  return (
    <AnimatePresence>
      {open && item && (
        <>
          <motion.button
            type="button"
            aria-label="Cerrar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ocean-950/55 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal
            aria-label={item.name}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            className="fixed inset-x-0 bottom-0 z-[70] mx-auto flex max-h-[96dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-sand shadow-2xl sm:inset-y-auto sm:bottom-6 sm:max-h-[min(92dvh,800px)] sm:max-w-lg sm:rounded-3xl"
          >
            <div className="relative w-full shrink-0">
              <div className="aspect-[5/4] w-full overflow-hidden bg-ocean-950 sm:aspect-[4/3]">
                <ProductImage
                  item={item}
                  fit="cover"
                  className="size-full"
                  priority
                  sizes="100vw"
                />
              </div>
              <button
                type="button"
                onClick={onClose}
                className="absolute top-3 right-3 z-20 flex size-10 items-center justify-center rounded-full bg-sand/95 text-ocean-900 shadow-md backdrop-blur-sm"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              <div className="px-5 pt-5 pb-3">
                {isPopular && (
                  <div className="mb-2">
                    <span className="rounded bg-lime-sea/80 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-ocean-950 uppercase">
                      Popular
                    </span>
                  </div>
                )}

                <h2 className="font-display text-[2rem] leading-none tracking-wide text-ocean-900">
                  {item.name}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ocean-900/65">
                  {item.description}
                </p>

                {needsSize && item.sizes && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-semibold tracking-wide text-ocean-900/50 uppercase">
                      Tamaño
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {item.sizes.map((size) => (
                        <ChoiceButton
                          key={size.id}
                          label={size.label}
                          hint={formatPrice(size.price)}
                          active={sizeId === size.id}
                          onClick={() => setSizeId(size.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {item.options?.map((group) => (
                  <OptionGroupPicker
                    key={group.id}
                    group={group}
                    value={selections[group.id]}
                    onChange={(choiceId) => setOption(group.id, choiceId)}
                  />
                ))}
              </div>

              <div className="mt-auto border-t border-ocean-900/8 px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-sm text-ocean-900/55">Precio</span>
                  <span className="text-xl font-bold tabular-nums text-ocean-950">
                    {formatPrice(unitPrice)}
                  </span>
                </div>

                {!canAdd ? (
                  <p className="mb-3 text-center text-xs text-ocean-900/55">
                    Elige todas las opciones para agregar.
                  </p>
                ) : null}

                {qty === 0 ? (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    disabled={!canAdd}
                    onClick={handleAdd}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-coral py-3.5 text-sm font-bold text-white transition hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus className="size-5" />
                    Agregar al pedido
                  </motion.button>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-1 rounded-2xl bg-ocean-800 p-1.5 text-white">
                      <button
                        type="button"
                        aria-label="Quitar uno"
                        onClick={() =>
                          setQty(makeCartKey(item.id, extras), qty - 1)
                        }
                        className="flex size-10 items-center justify-center rounded-xl hover:bg-white/15"
                      >
                        <Minus className="size-4" />
                      </button>
                      <span className="min-w-8 text-center text-base font-bold tabular-nums">
                        {qty}
                      </span>
                      <button
                        type="button"
                        aria-label="Agregar uno"
                        onClick={handleAdd}
                        className="flex size-10 items-center justify-center rounded-xl hover:bg-white/15"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 rounded-2xl bg-coral py-3.5 text-sm font-bold text-white transition hover:bg-coral-dark"
                    >
                      Listo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
