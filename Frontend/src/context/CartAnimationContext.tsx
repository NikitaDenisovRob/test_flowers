import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FlyItem {
  id: number
  fromX: number
  fromY: number
  toX: number
  toY: number
}

interface CartAnimationContextType {
  triggerFly: (fromEl: HTMLElement) => void
}

const CartAnimationContext = createContext<CartAnimationContextType>({ triggerFly: () => {} })

export function useCartAnimation() {
  return useContext(CartAnimationContext)
}

let nextId = 0

// Вычисляет N точек вдоль квадратичной кривой Безье
function quadraticBezier(
  p0x: number, p0y: number,
  p1x: number, p1y: number,
  p2x: number, p2y: number,
  n = 24
) {
  const xs: number[] = []
  const ys: number[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const mt = 1 - t
    xs.push(mt * mt * p0x + 2 * mt * t * p1x + t * t * p2x)
    ys.push(mt * mt * p0y + 2 * mt * t * p1y + t * t * p2y)
  }
  return { xs, ys }
}

function ArcDot({ item }: { item: FlyItem }) {
  const SIZE = 18

  // Точка управления дугой — высоко над серединой пути
  const midX = (item.fromX + item.toX) / 2
  const midY = (item.fromY + item.toY) / 2
  const dist = Math.hypot(item.toX - item.fromX, item.toY - item.fromY)
  // Уводим контрольную точку в сторону перпендикулярно и вверх
  const cpX = midX + (item.toX > item.fromX ? -dist * 0.65 : dist * 0.65)
  const cpY = midY - dist * 0.8

  const { xs, ys } = quadraticBezier(
    item.fromX, item.fromY,
    cpX, cpY,
    item.toX, item.toY
  )

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: SIZE,
        height: SIZE,
        borderRadius: '50%',
        background: '#635f40',
        boxShadow: '0 2px 10px rgba(99,95,64,0.5)',
        pointerEvents: 'none',
      }}
      animate={{
        x: xs.map(x => x - SIZE / 2),
        y: ys.map(y => y - SIZE / 2),
        scale: [
          ...Array(Math.floor(xs.length * 0.6)).fill(1),
          ...Array(Math.ceil(xs.length * 0.4)).fill(null).map((_, i, a) => 1 - i / a.length * 0.85),
        ],
        opacity: [
          ...Array(Math.floor(xs.length * 0.75)).fill(1),
          ...Array(Math.ceil(xs.length * 0.25)).fill(null).map((_, i, a) => 1 - i / a.length),
        ],
      }}
      transition={{
        duration: 0.9,
        ease: 'easeInOut',
      }}
    />
  )
}

export function CartAnimationProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FlyItem[]>([])

  const triggerFly = useCallback((fromEl: HTMLElement) => {
    const topEl = document.getElementById('top-cart-icon')
    const bottomEl = document.getElementById('bottom-cart-icon')
    // Use whichever is actually visible (non-zero size)
    const cartEl = (topEl && topEl.getBoundingClientRect().width > 0) ? topEl : bottomEl
    if (!cartEl) return

    const from = fromEl.getBoundingClientRect()
    const to = cartEl.getBoundingClientRect()

    const id = nextId++
    setItems(prev => [...prev, {
      id,
      fromX: from.left + from.width / 2,
      fromY: from.top + from.height / 2,
      toX: to.left + to.width / 2,
      toY: to.top + to.height / 2,
    }])

    setTimeout(() => {
      setItems(prev => prev.filter(i => i.id !== id))
    }, 1000)
  }, [])

  return (
    <CartAnimationContext.Provider value={{ triggerFly }}>
      {children}
      <div className="fixed inset-0 pointer-events-none z-[500]">
        <AnimatePresence>
          {items.map(item => <ArcDot key={item.id} item={item} />)}
        </AnimatePresence>
      </div>
    </CartAnimationContext.Provider>
  )
}
