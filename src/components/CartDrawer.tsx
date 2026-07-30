import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, Trash2, X, Loader2, MessageCircle } from 'lucide-react'
import { formatPrice, cartLineLabel } from '../data/menu'
import { useCart } from '../context/CartContext'
import { ProductImage } from './ProductImage'
import {
  buildWhatsAppMessage,
  openWhatsApp,
  openMercadoPagoIfNeeded,
  type CustomerInfo,
} from '../lib/whatsapp'
import { buildOrderPayload, saveOrderToSheets } from '../lib/sheets'
import { loadCustomerInfo, saveCustomerInfo } from '../lib/customerStorage'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { lines, total, setQty, removeItem, clear } = useCart()
  const [step, setStep] = useState<'cart' | 'checkout'>('cart')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<CustomerInfo>(loadCustomerInfo)

  useEffect(() => {
    saveCustomerInfo(form)
  }, [form])

  function handleClose() {
    onClose()
    setTimeout(() => {
      setStep('cart')
      setError('')
    }, 280)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.name.trim() || !form.phone.trim()) {
      setError('Nombre y teléfono son obligatorios.')
      return
    }
    if (form.orderType === 'domicilio' && !form.address.trim()) {
      setError('Ingresa la dirección de entrega.')
      return
    }
    if (lines.length === 0) {
      setError('Tu carrito está vacío.')
      return
    }

    setSending(true)
    try {
      const payload = buildOrderPayload(lines, total, form)
      const message = buildWhatsAppMessage(
        lines,
        total,
        form,
        payload.folio,
      )

      // WhatsApp primero y sin await previo: si no, móvil/PC bloquean el popup.
      openWhatsApp(message)
      openMercadoPagoIfNeeded(form.paymentMethod)

      // Sheets en segundo plano (no debe retrasar ni bloquear WhatsApp).
      void saveOrderToSheets(payload).catch((err) => {
        console.warn('[KITOS] No se pudo guardar en Sheets:', err)
      })

      clear()
      handleClose()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo enviar el pedido. Intenta de nuevo.',
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Cerrar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ocean-950/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.aside
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92dvh] max-w-lg flex-col rounded-t-3xl bg-sand shadow-2xl"
            role="dialog"
            aria-modal
            aria-label="Tu pedido"
          >
            <div className="flex items-center justify-between border-b border-ocean-900/8 px-5 py-4">
              <div>
                <p className="font-display text-2xl tracking-wide text-ocean-900">
                  {step === 'cart' ? 'Tu pedido' : 'Datos de entrega'}
                </p>
                <p className="text-xs text-ocean-900/55">
                  {step === 'cart'
                    ? `${lines.length} producto${lines.length === 1 ? '' : 's'}`
                    : 'Se enviará por WhatsApp y se guardará en Sheets'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="flex size-10 items-center justify-center rounded-full bg-white text-ocean-800"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {step === 'cart' ? (
                lines.length === 0 ? (
                  <p className="py-12 text-center text-ocean-900/50">
                    Aún no hay nada en el carrito.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {lines.map((line) => (
                      <li
                        key={line.key}
                        className="flex items-center gap-3 rounded-2xl bg-white/70 p-3"
                      >
                        <div className="size-12 shrink-0 overflow-hidden rounded-xl bg-ocean-950">
                          <ProductImage
                            item={line.item}
                            fit="cover"
                            className="size-full"
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-ocean-950">
                            {cartLineLabel(line.item, line.extrasLabel)}
                          </p>
                          <p className="text-sm text-ocean-700">
                            {formatPrice(line.unitPrice * line.qty)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="flex size-8 items-center justify-center rounded-full bg-foam text-ocean-800"
                            onClick={() => setQty(line.key, line.qty - 1)}
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold tabular-nums">
                            {line.qty}
                          </span>
                          <button
                            type="button"
                            className="flex size-8 items-center justify-center rounded-full bg-ocean-800 text-white"
                            onClick={() => setQty(line.key, line.qty + 1)}
                          >
                            <Plus className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label="Eliminar"
                            className="ml-1 flex size-8 items-center justify-center rounded-full text-coral"
                            onClick={() => removeItem(line.key)}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              ) : (
                <form
                  id="checkout-form"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white/70 p-1">
                    {(['recoger', 'domicilio'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setForm((f) => ({ ...f, orderType: type }))
                        }
                        className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                          form.orderType === type
                            ? 'bg-ocean-800 text-white'
                            : 'text-ocean-800'
                        }`}
                      >
                        {type === 'recoger' ? 'Recoger' : 'Domicilio'}
                      </button>
                    ))}
                  </div>

                  <Field
                    label="Nombre"
                    value={form.name}
                    onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                    placeholder="Tu nombre"
                    required
                  />
                  <Field
                    label="WhatsApp / Teléfono"
                    value={form.phone}
                    onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                    placeholder="55 1234 5678"
                    type="tel"
                    required
                  />
                  {form.orderType === 'domicilio' && (
                    <Field
                      label="Dirección"
                      value={form.address}
                      onChange={(v) =>
                        setForm((f) => ({ ...f, address: v }))
                      }
                      placeholder="Calle, colonia, referencias"
                      required
                    />
                  )}
                  <Field
                    label="Notas (opcional)"
                    value={form.notes}
                    onChange={(v) => setForm((f) => ({ ...f, notes: v }))}
                    placeholder="Sin cebolla, extra limón..."
                  />

                  <div>
                    <p className="mb-1.5 text-xs font-semibold tracking-wide text-ocean-900/55 uppercase">
                      Forma de pago
                    </p>
                    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white/70 p-1">
                      {(
                        [
                          { id: 'efectivo' as const, label: 'Efectivo' },
                          { id: 'tarjeta' as const, label: 'Tarjeta' },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              paymentMethod: opt.id,
                            }))
                          }
                          className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                            form.paymentMethod === opt.id
                              ? 'bg-ocean-800 text-white'
                              : 'text-ocean-800'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {form.paymentMethod === 'tarjeta' && (
                      <p className="mt-2 text-xs leading-relaxed text-ocean-900/55">
                        Si hay link de Mercado Pago configurado, se abrirá al
                        confirmar el pedido. También va en el mensaje de
                        WhatsApp.
                      </p>
                    )}
                  </div>

                  {error && (
                    <p className="rounded-xl bg-coral/10 px-3 py-2 text-sm text-coral-dark">
                      {error}
                    </p>
                  )}
                </form>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-ocean-900/8 px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-ocean-900/60">Total</span>
                  <span className="text-xl font-bold tabular-nums text-ocean-950">
                    {formatPrice(total)}
                  </span>
                </div>

                {step === 'cart' ? (
                  <button
                    type="button"
                    onClick={() => setStep('checkout')}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-coral py-3.5 text-sm font-bold text-white transition hover:bg-coral-dark"
                  >
                    Continuar
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep('cart')}
                      className="rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold text-ocean-800"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      form="checkout-form"
                      disabled={sending}
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3.5 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-70"
                    >
                      {sending ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : (
                        <MessageCircle className="size-5" />
                      )}
                      {sending ? 'Enviando…' : 'Pedir por WhatsApp'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold tracking-wide text-ocean-900/55 uppercase">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-ocean-900/10 bg-white px-4 py-3 text-sm outline-none ring-ocean-600 focus:ring-2"
      />
    </label>
  )
}
