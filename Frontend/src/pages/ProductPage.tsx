import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, type MouseEvent } from 'react'
import { ChevronDown, ChevronLeft, ShoppingBag, Check } from 'lucide-react'
import { products } from '../data/mock'
import { useCart } from '../context/CartContext'
import { useCartAnimation } from '../context/CartAnimationContext'
import Footer from '../components/Footer'

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { triggerFly } = useCartAnimation()

  const product = products.find(p => p.id === id)

  const [selectedSize, setSelectedSize] = useState(1)
  const [added, setAdded] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>('composition')

  if (!product) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <div className="text-center px-5 pt-20">
          <h1 className="font-heading text-5xl text-outline-variant mb-6">404</h1>
          <p className="font-body text-sm text-outline mb-8">Композиция не найдена</p>
          <button
            onClick={() => navigate(-1)}
            className="label-caps text-sage hover:text-charcoal transition-colors cursor-pointer"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    )
  }

  const currentPrice = Math.round(product.price * product.sizes[selectedSize].priceMultiplier / 100) * 100

  const handleAdd = (e: MouseEvent<HTMLButtonElement>) => {
    addToCart(product)
    triggerFly(e.currentTarget)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const detailSections = [
    {
      id: 'composition',
      title: 'Состав',
      content: (
        <ul className="space-y-2">
          {product.composition.map(item => (
            <li key={item} className="font-body text-sm text-charcoal-light">{item}</li>
          ))}
        </ul>
      ),
    },
    {
      id: 'care',
      title: 'Уход',
      content: <p className="font-body text-sm text-charcoal-light leading-relaxed">{product.care}</p>,
    },
    {
      id: 'delivery',
      title: 'Доставка',
      content: (
        <div className="space-y-2 font-body text-sm text-charcoal-light">
          <p>Бесплатная доставка по центру Москвы в течение 2 часов.</p>
          <p>Специальная упаковка для сохранения свежести.</p>
        </div>
      ),
    },
  ]

  return (
    <div className="bg-surface min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 pt-24 md:pt-28 pb-4">
        <div className="flex items-center gap-2 font-body text-xs text-outline">
          <Link to="/catalog" className="hover:text-charcoal transition-colors flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" />
            Коллекция
          </Link>
          <span className="text-outline-variant">/</span>
          <span className="text-charcoal">{product.name}</span>
        </div>
      </div>

      {/* Product layout */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 pb-20 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-ambient sticky top-28">
              <div className="aspect-[3/4] bg-surface-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.badge && (
                <span className="absolute top-6 left-6 label-caps text-[10px] px-3 py-1.5 rounded-full bg-charcoal text-white">
                  {product.badge === 'bestseller' && 'Бестселлер'}
                  {product.badge === 'new' && 'Новинка'}
                  {product.badge === 'sale' && 'Скидка'}
                </span>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          >
            <p className="label-caps text-sage mb-4">{product.subtitle}</p>

            <h1
              className="font-heading text-3xl md:text-5xl text-charcoal mb-4"
              style={{ letterSpacing: '-0.02em' }}
            >
              {product.name}
            </h1>

            <p className="font-heading text-2xl md:text-3xl text-charcoal mb-8">
              {currentPrice.toLocaleString('ru-RU')} ₽
              {product.originalPrice && (
                <span className="ml-3 text-lg text-outline-variant line-through">
                  {Math.round(product.originalPrice * product.sizes[selectedSize].priceMultiplier / 100) * 100} ₽
                </span>
              )}
            </p>

            <p className="font-body text-sm text-outline leading-relaxed mb-10 max-w-md">
              {product.fullDescription}
            </p>

            {/* Size selector */}
            <div className="mb-8">
              <p className="label-caps text-outline mb-4">Размер</p>
              <div className="flex gap-3">
                {product.sizes.map((size, i) => (
                  <button
                    key={size.label}
                    onClick={() => setSelectedSize(i)}
                    className={`px-6 py-3 rounded-full border font-body text-sm cursor-pointer transition-all duration-200 ${
                      selectedSize === i
                        ? 'border-primary bg-primary text-white'
                        : 'border-outline text-charcoal-light hover:border-charcoal hover:text-charcoal'
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <motion.button
              onClick={(e) => handleAdd(e)}
              whileTap={{ scale: 0.97 }}
              className={`w-full md:w-auto md:min-w-[280px] flex items-center justify-center gap-3 py-4 px-8 rounded-full font-jost font-semibold text-sm tracking-widest uppercase cursor-pointer transition-all duration-300 ${
                added
                  ? 'bg-primary text-white'
                  : 'bg-charcoal text-white hover:bg-charcoal-light'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  Добавлено
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  В корзину — {currentPrice.toLocaleString('ru-RU')} ₽
                </>
              )}
            </motion.button>

            {/* Detail sections */}
            <div className="mt-12 border-t border-outline-variant/30">
              {detailSections.map(section => (
                <div key={section.id} className="border-b border-outline-variant/30">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between py-5 cursor-pointer group"
                  >
                    <span className="font-body font-medium text-sm text-charcoal">
                      {section.title}
                    </span>
                    <motion.div
                      animate={{ rotate: openSection === section.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-outline group-hover:text-charcoal transition-colors" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openSection === section.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-5">
                          {section.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
