import type { CustomerInfo } from './whatsapp'

const STORAGE_KEY = 'kitos-customer-v1'

const defaults: CustomerInfo = {
  name: '',
  phone: '',
  address: '',
  notes: '',
  orderType: 'recoger',
  paymentMethod: 'efectivo',
}

export function loadCustomerInfo(): CustomerInfo {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaults }
    const parsed = JSON.parse(raw) as Partial<CustomerInfo>
    return {
      name: typeof parsed.name === 'string' ? parsed.name : '',
      phone: typeof parsed.phone === 'string' ? parsed.phone : '',
      address: typeof parsed.address === 'string' ? parsed.address : '',
      notes: '',
      orderType: parsed.orderType === 'domicilio' ? 'domicilio' : 'recoger',
      paymentMethod:
        parsed.paymentMethod === 'tarjeta' ? 'tarjeta' : 'efectivo',
    }
  } catch {
    return { ...defaults }
  }
}

export function saveCustomerInfo(info: CustomerInfo): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        name: info.name,
        phone: info.phone,
        address: info.address,
        orderType: info.orderType,
        paymentMethod: info.paymentMethod,
      }),
    )
  } catch {
    // ignore
  }
}
