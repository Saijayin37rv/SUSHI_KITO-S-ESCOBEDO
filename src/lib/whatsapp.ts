import type { CartLine } from '../context/CartContext'
import { cartLineLabel, formatPrice } from '../data/menu'

export type OrderType = 'recoger' | 'domicilio'
export type PaymentMethod = 'efectivo' | 'tarjeta'

export interface CustomerInfo {
  name: string
  phone: string
  address: string
  notes: string
  orderType: OrderType
  paymentMethod: PaymentMethod
}

function paymentLabel(method: PaymentMethod): string {
  return method === 'tarjeta' ? 'Tarjeta (Mercado Pago)' : 'Efectivo'
}

function orderTypeLabel(type: OrderType): string {
  return type === 'domicilio' ? 'Domicilio' : 'Recoger'
}

/** Solo dígitos; WhatsApp no acepta +, espacios ni guiones. */
export function normalizeWhatsAppPhone(raw: string | undefined): string | null {
  if (!raw || raw.includes('XXXX')) return null
  const digits = raw.replace(/\D/g, '')
  return digits.length >= 10 ? digits : null
}

function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  if (/Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return true
  }
  return navigator.maxTouchPoints > 1 && window.innerWidth < 900
}

/**
 * Mensaje sin emojis: en WhatsApp (móvil/Windows) a veces salen mal.
 * Solo texto + negritas (*...*).
 */
export function buildWhatsAppMessage(
  lines: CartLine[],
  total: number,
  customer: CustomerInfo,
  folio: string,
): string {
  const items = lines
    .map(
      (l) =>
        `- ${l.qty}x ${cartLineLabel(l.item, l.extrasLabel)} = ${formatPrice(l.unitPrice * l.qty)}`,
    )
    .join('\n')

  const rawMp = import.meta.env.VITE_MERCADOPAGO_LINK as string | undefined
  const mpLink =
    rawMp && !rawMp.includes('TU_LINK')
      ? /^https?:\/\//i.test(rawMp)
        ? rawMp
        : `https://${rawMp}`
      : undefined
  const hasMpLink =
    customer.paymentMethod === 'tarjeta' && Boolean(mpLink)

  const linesOut = [
    '*PEDIDO KITOS MARISCOS*',
    `Folio: ${folio}`,
    '',
    `*Cliente:* ${customer.name.trim()}`,
    `*Tel:* ${customer.phone.trim()}`,
    `*Entrega:* ${orderTypeLabel(customer.orderType)}`,
    customer.orderType === 'domicilio' && customer.address.trim()
      ? `*Direccion:* ${customer.address.trim()}`
      : null,
    `*Pago:* ${paymentLabel(customer.paymentMethod)}`,
    customer.notes.trim() ? `*Notas:* ${customer.notes.trim()}` : null,
    '',
    '*Detalle:*',
    items,
    '',
    `*TOTAL: ${formatPrice(total)}*`,
  ]

  if (hasMpLink) {
    linesOut.push('', '*Link de pago Mercado Pago:*', mpLink!)
  } else if (customer.paymentMethod === 'tarjeta') {
    linesOut.push(
      '',
      '_Pago con tarjeta: confirmar con el negocio (terminal o link)._',
    )
  }

  return linesOut.filter((l) => l !== null).join('\n')
}

export function buildWhatsAppUrl(message: string, phone?: string): string {
  const number =
    normalizeWhatsAppPhone(phone) ??
    normalizeWhatsAppPhone(import.meta.env.VITE_WHATSAPP_NUMBER)

  if (!number) {
    throw new Error(
      'Configura VITE_WHATSAPP_NUMBER en tu archivo .env (solo dígitos, con código de país).',
    )
  }

  // api.whatsapp.com es más fiable que wa.me en iOS/Android y escritorio.
  // encodeURIComponent (no URLSearchParams): WhatsApp a veces falla con "+" en espacios.
  return `https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`
}

/**
 * Abre WhatsApp de forma compatible con móvil y PC.
 * Debe llamarse en el mismo tick del click (sin await previo),
 * o los navegadores bloquean el popup.
 */
export function openWhatsApp(message: string): void {
  const url = buildWhatsAppUrl(message)

  if (isMobileDevice()) {
    // Misma pestaña: evita bloqueo de popups en Safari/Chrome móvil.
    window.location.assign(url)
    return
  }

  // Escritorio: intentar pestaña nueva; si el bloqueador interviene, misma pestaña.
  const opened = window.open(url, '_blank')
  if (!opened) {
    window.location.assign(url)
  }
}

/**
 * Abre Mercado Pago sin pelear con el popup de WhatsApp.
 * En móvil no abre segunda ventana (el link ya va en el mensaje).
 */
export function openMercadoPagoIfNeeded(method: PaymentMethod): void {
  if (method !== 'tarjeta') return
  if (isMobileDevice()) return

  let link = import.meta.env.VITE_MERCADOPAGO_LINK as string | undefined
  if (!link || link.includes('TU_LINK')) return
  if (!/^https?:\/\//i.test(link)) {
    link = `https://${link}`
  }

  // Pequeño delay para no competir con el popup de WhatsApp.
  window.setTimeout(() => {
    window.open(link, '_blank', 'noopener,noreferrer')
  }, 600)
}
