import { Link, useLocation } from 'react-router-dom'
import { Home, LayoutGrid, ShoppingBag, Heart } from 'lucide-react'
import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useContactFloat } from '../context/ContactFloatContext'

const LEFT = [
  { to: '/', icon: Home, label: 'Главная' },
  { to: '/catalog', icon: LayoutGrid, label: 'Каталог' },
]

const RIGHT = [
  { to: '/catalog?cat=roses', icon: Heart, label: 'Избранное' },
  { to: '/cart', icon: ShoppingBag, label: 'Корзина' },
]

function NavItem({
  to,
  icon: Icon,
  label,
  cartControls,
}: {
  to: string
  icon: typeof Home
  label: string
  cartControls?: ReturnType<typeof useAnimation>
}) {
  const { pathname } = useLocation()
  const { totalItems } = useCart()
  const active = to === '/' ? pathname === '/' : pathname.startsWith(to.split('?')[0])
  const isCart = to === '/cart'

  return (
    <Link to={to} className="relative flex flex-col items-center gap-1 cursor-pointer py-1 px-3">
      <div className="relative" id={isCart ? 'bottom-cart-icon' : undefined}>
        {isCart && cartControls ? (
          <motion.div animate={cartControls}>
            <Icon className="w-5 h-5" style={{ color: active ? '#1b1c1c' : '#7a776c', strokeWidth: active ? 2.2 : 1.6 }} />
          </motion.div>
        ) : (
          <Icon className="w-5 h-5" style={{ color: active ? '#1b1c1c' : '#7a776c', strokeWidth: active ? 2.2 : 1.6 }} />
        )}
        {isCart && totalItems > 0 && (
          <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-charcoal text-white text-[9px] font-body font-bold flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </div>
      <span className="text-[10px] font-body font-medium leading-none" style={{ color: active ? '#1b1c1c' : '#7a776c' }}>
        {label}
      </span>
    </Link>
  )
}

export default function MobileBottomNav() {
  const { totalItems } = useCart()
  const { open, visible } = useContactFloat()
  const cartControls = useAnimation()

  useEffect(() => {
    if (totalItems > 0) {
      cartControls.start({ scale: [1, 1.7, 0.85, 1.25, 1], transition: { duration: 0.5, ease: 'easeOut' } })
    }
  }, [totalItems])

  const ease = [0.16, 1, 0.3, 1] as const
  const transition = { duration: 0.5, ease }

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-outline-variant/20"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center px-2 pt-2 pb-2">
        {/* Левая группа */}
        <div className="flex flex-1 items-center justify-around">
          {LEFT.map(item => <NavItem key={item.to} {...item} />)}
        </div>

        {/* Центральный gap — вырастает когда кнопка появляется */}
        <motion.div
          className="flex-shrink-0 overflow-hidden"
          animate={{ width: visible ? 64 : 0 }}
          transition={transition}
        />

        {/* Правая группа */}
        <div className="flex flex-1 items-center justify-around">
          {RIGHT.map(item => <NavItem key={item.to} {...item} cartControls={cartControls} />)}
        </div>
      </div>
    </nav>
  )
}
