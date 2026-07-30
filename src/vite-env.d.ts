/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WHATSAPP_NUMBER: string
  readonly VITE_SHEETS_WEBAPP_URL: string
  readonly VITE_MERCADOPAGO_LINK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
