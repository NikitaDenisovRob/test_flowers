import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Menu, X, ShoppingBag } from 'lucide-react'
import { motion, useAnimation } from 'framer-motion'
import SearchOverlay from './SearchOverlay'
import { useCart } from '../context/CartContext'

const NAV_LINKS = [
  { to: '/catalog', label: 'Коллекция' },
  { to: '/catalog?cat=author', label: 'Авторские' },
  { to: '/catalog?cat=roses', label: 'Розы' },
  { to: '/catalog?cat=seasonal', label: 'Сезонные' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { totalItems } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const cartControls = useAnimation()

  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (totalItems > 0) {
      cartControls.start({ scale: [1, 1.45, 0.88, 1.18, 1], transition: { duration: 0.48, ease: 'easeOut' } })
    }
  }, [totalItems])

  const light = isHome && !scrolled

  const linkColor = light ? 'rgba(255,255,255,0.7)' : '#7a776c'
  const linkHover = light ? '#fff' : '#1b1c1c'
  const iconColor = light ? '#fff' : '#1b1c1c'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          light ? 'bg-transparent' : 'glass border-b border-outline-variant/30'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-5 md:px-16 h-16 md:h-20 flex items-center">

          {/* ── Left group ── */}
          <div className="flex-1 flex items-center">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center cursor-pointer"
              style={{ color: iconColor }}
              aria-label="Меню"
            >
              <Menu className="w-5 h-5" />
            </button>

            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.slice(0, 2).map(l => (
                <Link
                  key={l.to} to={l.to}
                  className="label-caps transition-colors duration-200"
                  style={{ color: linkColor }}
                  onMouseEnter={e => (e.currentTarget.style.color = linkHover)}
                  onMouseLeave={e => (e.currentTarget.style.color = linkColor)}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Logo — always centered ── */}
          <Link to="/" className="flex-shrink-0 mx-4">
            <span
              className="font-heading text-xl md:text-2xl tracking-tight whitespace-nowrap"
              style={{ color: light ? '#fff' : '#1b1c1c' }}
            >
              L'Art de Fleur
            </span>
          </Link>

          {/* ── Right group ── */}
          <div className="flex-1 flex items-center justify-end">
            <nav className="hidden md:flex items-center gap-8 mr-4">
              {NAV_LINKS.slice(2).map(l => (
                <Link
                  key={l.to} to={l.to}
                  className="label-caps transition-colors duration-200"
                  style={{ color: linkColor }}
                  onMouseEnter={e => (e.currentTarget.style.color = linkHover)}
                  onMouseLeave={e => (e.currentTarget.style.color = linkColor)}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 flex items-center justify-center cursor-pointer"
              style={{ color: iconColor }}
              aria-label="Поиск"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              to="/cart"
              className="hidden md:flex relative w-10 h-10 items-center justify-center cursor-pointer"
              style={{ color: iconColor }}
              aria-label="Корзина"
            >
              <motion.div animate={cartControls} id="top-cart-icon" className="flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </motion.div>
              {totalItems > 0 && (
                <span
                  className="absolute top-1.5 right-1 w-4 h-4 rounded-full text-[9px] font-body font-bold flex items-center justify-center"
                  style={{ background: light ? 'rgba(255,255,255,0.9)' : '#1b1c1c', color: light ? '#1b1c1c' : '#fff' }}
                >
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-charcoal/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-72 bg-surface flex flex-col" style={{ boxShadow: '4px 0 30px rgba(0,0,0,0.1)' }}>

            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
              <span className="font-heading text-xl text-charcoal">L'Art de Fleur</span>
              <button onClick={() => setMobileOpen(false)} className="w-10 h-10 flex items-center justify-center cursor-pointer text-charcoal" aria-label="Закрыть">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-8">
              <div>
                <p className="label-caps text-outline-variant mb-4">Навигация</p>
                <nav className="flex flex-col gap-4">
                  {[{ to: '/', label: 'Главная' }, { to: '/catalog', label: 'Коллекция' }].map(l => (
                    <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                      className="font-body text-base text-charcoal-light hover:text-charcoal transition-colors">
                      {l.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div>
                <p className="label-caps text-outline-variant mb-4">Информация</p>
                <nav className="flex flex-col gap-4">
                  <Link to="/delivery" onClick={() => setMobileOpen(false)}
                    className="font-body text-base text-charcoal-light hover:text-charcoal transition-colors">
                    Доставка и оплата
                  </Link>
                </nav>
              </div>
            </div>

            <div className="px-6 py-5 border-t border-outline-variant/30">
              <p className="font-body text-xs text-outline-variant">© 2025 L'Art de Fleur</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
