import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Check } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '../data/mock'
import { useCart } from '../context/CartContext'
import { useCartAnimation } from '../context/CartAnimationContext'

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { triggerFly } = useCartAnimation()
  const [added, setAdded] = useState(false)

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (added) return
    addToCart(product)
    triggerFly(e.currentTarget)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Image */}
        <div className="relative rounded-3xl overflow-hidden mb-4 shadow-ambient">
          <div className="aspect-[3/4] bg-surface-container">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
              loading="lazy"
            />
          </div>

          {product.badge && (
            <span className="absolute top-4 left-4 label-caps text-[10px] px-3 py-1.5 rounded-full bg-charcoal text-white">
              {product.badge === 'bestseller' && 'Бестселлер'}
              {product.badge === 'new' && 'Новинка'}
              {product.badge === 'sale' && 'Скидка'}
            </span>
          )}

          {/* Quick add button */}
          <button
            onClick={handleAdd}
            className="absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0"
            style={{
              background: added ? '#635f40' : 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            }}
            aria-label="Добавить в корзину"
          >
            <AnimatePresence mode="wait">
              {added ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.span>
              ) : (
                <motion.span
                  key="bag"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ShoppingBag className="w-4 h-4 text-charcoal" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Info */}
        <div className="text-center px-1">
          <h3 className="font-heading text-xl md:text-2xl text-charcoal mb-1">
            {product.name}
          </h3>
          <p className="label-caps text-outline mb-2">
            {product.subtitle}
          </p>
          <p className="font-body text-sm text-charcoal">
            {product.price.toLocaleString('ru-RU')} ₽
            {product.originalPrice && (
              <span className="ml-2 line-through text-outline-variant text-xs">
                {product.originalPrice.toLocaleString('ru-RU')} ₽
              </span>
            )}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
