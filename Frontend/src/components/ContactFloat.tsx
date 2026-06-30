import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Send } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useContactFloat } from '../context/ContactFloatContext'

const CONTACTS = [
  {
    label: 'WhatsApp',
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.943l6.265-1.644A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.878 9.878 0 01-5.032-1.378l-.36-.214-3.733.979.996-3.648-.235-.374A9.861 9.861 0 012.106 12C2.106 6.58 6.58 2.106 12 2.106S21.894 6.58 21.894 12 17.42 21.894 12 21.894z"/>
      </svg>
    ),
    href: 'https://wa.me/79999999999',
    color: '#25D366',
  },
  {
    label: 'Telegram',
    icon: Send,
    href: 'https://t.me/username',
    color: '#229ED9',
  },
  {
    label: 'Позвонить',
    icon: Phone,
    href: 'tel:+79999999999',
    color: '#635f40',
  },
]

const liquidGlass = {
  background: 'rgba(255,255,255,0.2)',
  backdropFilter: 'blur(40px) saturate(180%)',
  WebkitBackdropFilter: 'blur(40px) saturate(180%)',
  border: '1.5px solid rgba(255,255,255,0.55)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08), inset 0 1.5px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(255,255,255,0.12)',
}

// Кнопка: центр совпадает с верхней границей навбара
// Навбар ≈ 58px + safe-area. bottom = 30px + safe-area → центр кнопки (28px) = 58px = верх навбара
const WRAPPER_STYLE: React.CSSProperties = {
  position: 'fixed',
  bottom: 'calc(30px + env(safe-area-inset-bottom, 0px))',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 90,
}

const CONTACTS_WRAPPER_STYLE: React.CSSProperties = {
  position: 'fixed',
  bottom: 'calc(30px + env(safe-area-inset-bottom, 0px) + 64px)',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 89,
}

export default function ContactFloat() {
  const { open, setOpen, visible, setVisible } = useContactFloat()
  const { pathname } = useLocation()

  useEffect(() => {
    const check = () => {
      if (pathname === '/') {
        setVisible(window.scrollY >= window.innerHeight * 0.8)
      } else {
        setVisible(true)
      }
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [pathname])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      {/* Контакты — отдельный wrapper, не влияет на позицию кнопки */}
      <div className="md:hidden" style={CONTACTS_WRAPPER_STYLE}>
        <AnimatePresence>
          {visible && open && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-2"
            >
              {CONTACTS.map((c, i) => (
                <motion.a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith('tel') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.9 }}
                  transition={{ delay: i * 0.06, duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-full cursor-pointer whitespace-nowrap"
                  style={{
                    background: '#ffffff',
                    border: '0.5px solid rgba(0,0,0,0.07)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                >
                  <span className="font-body text-sm text-charcoal font-medium">{c.label}</span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                    style={{ background: c.color }}
                  >
                    {c.label === 'WhatsApp' ? <c.icon /> : <c.icon className="w-4 h-4" />}
                  </div>
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Кнопка — отдельный wrapper, позиция не меняется */}
      <div className="md:hidden" style={WRAPPER_STYLE}>
        <AnimatePresence>
          {visible && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.button
                onClick={() => setOpen(o => !o)}
                whileTap={{ scale: 0.88 }}
                className="flex items-center justify-center cursor-pointer relative"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  ...liquidGlass,
                }}
                aria-label="Связаться"
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '52%',
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.04) 100%)',
                    pointerEvents: 'none',
                  }}
                />
                <AnimatePresence mode="wait">
                  {open ? (
                    <motion.div
                      key="x"
                      initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      style={{ position: 'relative', zIndex: 1 }}
                    >
                      <X className="w-5 h-5 text-charcoal" strokeWidth={2} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="phone"
                      initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      style={{ position: 'relative', zIndex: 1 }}
                    >
                      <Phone className="w-5 h-5 text-charcoal" strokeWidth={1.7} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
