# KITOS Mariscos

Menú digital mobile-first para pedidos por WhatsApp. Catálogo estático, carrito local, registro opcional en Google Sheets y badges de productos populares.

## Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4
- Framer Motion + Lucide
- Google Apps Script (pedidos + ranking)
- Deploy a GitHub Pages (`.github/workflows/deploy.yml`)

## Arranque local

```bash
cp .env.example .env
npm install
npm run dev
```

Rellena `.env`:

| Variable | Descripción |
|----------|-------------|
| `VITE_WHATSAPP_NUMBER` | Número con código de país, sin `+` ni espacios (ej. `5215512345678`) |
| `VITE_SHEETS_WEBAPP_URL` | URL `/exec` del Web App de Apps Script |
| `VITE_MERCADOPAGO_LINK` | (Opcional) link de pago Mercado Pago |

Sin WhatsApp configurado, el checkout falla con un mensaje claro. Sin Sheets, el pedido igual sale por WhatsApp.

## Google Sheets

1. Crea una hoja de cálculo (ej. "Pedidos Kitos").
2. Extensiones → Apps Script → pega `google-apps-script/Code.gs`.
3. Implementar → Nueva implementación → Aplicación web:
   - Ejecutar como: Yo
   - Quién tiene acceso: Cualquiera
4. Copia la URL `/exec` a `VITE_SHEETS_WEBAPP_URL`.
5. Cada cambio del script: Administrar implementaciones → Nueva versión.

El script crea las hojas `Pedidos` y `Ranking`. El ranking alimenta el badge **Popular** en el menú.

## Scripts

```bash
npm run dev      # desarrollo
npm run build    # producción
npm run preview  # previsualizar dist
npm run lint     # oxlint
```

## Estructura

```
src/
  components/   Hero, menú, carrito, checkout
  context/      Carrito (persistido en localStorage)
  data/         Catálogo y precios
  hooks/        Productos populares (Sheets)
  lib/          WhatsApp, Sheets, datos del cliente
public/images/  Fotos de platillos
google-apps-script/  Backend de pedidos
```

## Notas

- El carrito y los datos del cliente (nombre, tel, dirección) se guardan en `localStorage`.
- El pago con tarjeta abre el link de Mercado Pago si está configurado; Checkout Pro completo requiere backend.
- En GitHub Pages configura los mismos nombres como Secrets del repositorio.
