import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export function Hero() {
  return (
    <header className="wave-bg relative overflow-hidden text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40 Q15 30 30 40 T60 40' fill='none' stroke='%23ffffff' stroke-width='1' opacity='0.25'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[88dvh] max-w-lg flex-col justify-end px-5 pb-16 pt-10 sm:max-w-2xl sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3 text-sm font-medium tracking-[0.2em] text-lime-sea uppercase"
        >
          Fresco · del día
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-display text-[clamp(4.5rem,18vw,7.5rem)] leading-[0.85] tracking-wide"
        >
          KITOS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mt-2 font-display text-[clamp(1.75rem,6vw,2.75rem)] tracking-wider text-foam/90"
        >
          MARISCOS
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="mt-5 max-w-sm text-base leading-relaxed text-foam/80 text-balance"
        >
          Arma tu pedido y 
          confírmalo por WhatsApp.
        </motion.p>

        <motion.a
          href="#menu"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.42 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-coral px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-coral/30 transition hover:bg-coral-dark"
        >
          Ver menú
          <ChevronDown className="size-4 animate-bounce" />
        </motion.a>
      </div>

      <svg
        className="absolute bottom-0 left-0 w-full text-sand"
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0,32 C360,48 720,0 1080,24 C1260,36 1380,40 1440,32 L1440,48 L0,48 Z"
        />
      </svg>
    </header>
  )
}
