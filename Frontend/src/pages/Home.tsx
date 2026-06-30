import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronDown, Truck, Leaf, Paintbrush, Sparkles } from 'lucide-react'
import { products, collections, reviews, shopInfo } from '../data/mock'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'
import SearchOverlay from '../components/SearchOverlay'

const bestsellers = products.filter(p => p.badge === 'bestseller')

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
}

const SLIDES = [
  {
    bg: '/fl1.png',
    label: 'Цветочное Ателье',
    title: shopInfo.tagline,
    subtitle: 'Каждая композиция — результат безупречного мастерства и любви к ботанической красоте',
    cta: 'catalog' as const,
  },
  {
    bg: '/ns.png',
    label: 'Нейропоиск',
    title: 'Найдите идеальный букет с помощью ИИ',
    subtitle: 'Опишите повод или настроение — нейроассистент подберёт композицию специально для вас',
    cta: 'neural' as const,
  },
]

const glassBtn = {
  background: 'rgba(255,255,255,0.22)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.4)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)',
  color: '#ffffff',
}

const textVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
}


export default function Home() {
  const [[slide, dir], setSlide] = useState([0, 0])
  const [neuralOpen, setNeuralOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goTo = useCallback((idx: number, direction: number) => {
    setSlide([idx, direction])
  }, [])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setSlide(([s]) => [(s + 1) % SLIDES.length, 1])
    }, 6000)
  }, [])

  useEffect(() => {
    resetTimer()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [slide, resetTimer])

  const handleDotClick = (i: number) => {
    goTo(i, i > slide ? 1 : -1)
    resetTimer()
  }

  // Touch swipe
  const touchStartX = useRef(0)
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(dx) < 40) return
    const dir = dx > 0 ? 1 : -1
    setSlide(([s]) => [(s + dir + SLIDES.length) % SLIDES.length, dir])
    resetTimer()
  }

  return (
    <div className="bg-surface">
      {/* ═══════ HERO ═══════ */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Background image — crossfade between slides */}
        <div className="absolute inset-0">
          <AnimatePresence mode="sync">
            <motion.img
              key={slide}
              src={SLIDES[slide].bg}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-charcoal/40" />
        </div>

        {/* Slides */}
        <div className="relative z-10 text-center px-5 max-w-3xl mx-auto w-full">
          {/* Текст — с opacity для красивого fade */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={slide}
              custom={dir}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center mb-12"
            >
              <p className="label-caps text-white/70 mb-6">{SLIDES[slide].label}</p>
              <h1
                className="font-heading text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-6"
                style={{ letterSpacing: '-0.02em' }}
              >
                {SLIDES[slide].title}
              </h1>
              <p className="font-body text-base md:text-lg text-white/70 font-light max-w-lg mx-auto">
                {SLIDES[slide].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Кнопка — без анимации opacity/x, backdrop-filter всегда активен */}
          <div className="flex justify-center">
            {SLIDES[slide].cta === 'catalog' ? (
              <Link
                to="/catalog"
                className="inline-flex items-center gap-3 font-body font-semibold text-sm px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.03]"
                style={glassBtn}
              >
                Исследовать коллекцию
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                onClick={() => setNeuralOpen(true)}
                className="inline-flex items-center gap-3 font-body font-semibold text-sm px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.03] cursor-pointer"
                style={glassBtn}
              >
                <Sparkles className="w-4 h-4" />
                Попробовать нейропоиск
              </button>
            )}
          </div>
        </div>

        {/* Dots + scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                className="cursor-pointer transition-all duration-300"
                style={{
                  width: i === slide ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === slide ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
                }}
              />
            ))}
          </div>
          {/* Scroll */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="label-caps text-[10px] text-white/40">Вниз</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <ChevronDown className="w-4 h-4 text-white/40" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <SearchOverlay open={neuralOpen} onClose={() => setNeuralOpen(false)} initialTab="neural" />

      {/* ═══════ COLLECTIONS ═══════ */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-16 py-20 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 md:mb-16">
          <div>
            <p className="label-caps text-sage mb-3">Коллекции</p>
            <h2 className="font-heading text-3xl md:text-5xl text-charcoal" style={{ letterSpacing: '-0.02em' }}>
              Наши Коллекции
            </h2>
          </div>
          <p className="font-body text-sm text-outline max-w-sm">
            Каждая коллекция — уникальная история, рассказанная языком цветов
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((col, i) => (
            <motion.div
              key={col.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={i}
            >
              <Link
                to={col.link}
                className="group relative block rounded-3xl overflow-hidden shadow-ambient"
                style={{ aspectRatio: '16/10' }}
              >
                <img
                  src={col.image}
                  alt={col.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <span className="font-heading text-3xl md:text-4xl text-white/20 mb-2 block">
                    {col.number}
                  </span>
                  <h3 className="font-heading text-xl md:text-2xl text-white mb-2">
                    {col.title}
                  </h3>
                  <p className="font-body text-sm text-white/60 max-w-xs">
                    {col.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 label-caps text-outline hover:text-charcoal transition-colors duration-200"
          >
            Смотреть все <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ═══════ BESTSELLERS ═══════ */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-16 pb-20 md:pb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 md:mb-16">
          <div>
            <p className="label-caps text-sage mb-3">Избранное</p>
            <h2 className="font-heading text-3xl md:text-5xl text-charcoal" style={{ letterSpacing: '-0.02em' }}>
              Бестселлеры
            </h2>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 label-caps text-outline hover:text-charcoal transition-colors duration-200"
          >
            Вся коллекция <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {bestsellers.map((product, i) => (
            <motion.div
              key={product.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={i}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════ PROMISE ═══════ */}
      <section className="border-t border-outline-variant/30">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-20 md:py-28">
          <div className="text-center mb-14">
            <p className="label-caps text-sage mb-3">Наше обещание</p>
            <h2 className="font-heading text-3xl md:text-4xl text-charcoal">
              Почему L'Art de Fleur
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 max-w-4xl mx-auto">
            {[
              { icon: Truck, title: 'Доставка', desc: 'Бесплатная доставка по центру Москвы в течение 2 часов.' },
              { icon: Leaf, title: 'Свежесть', desc: 'Каждый цветок проходит контроль качества. Гарантируем свежесть 7+ дней.' },
              { icon: Paintbrush, title: 'Мастерство', desc: 'Наши флористы — выпускники европейских школ флористики.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-xl text-charcoal mb-3">{item.title}</h3>
                <p className="font-body text-sm text-outline leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ REVIEWS ═══════ */}
      <section className="bg-surface-container-low">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-20 md:py-28">
          <div className="text-center mb-14">
            <p className="label-caps text-sage mb-3">Отзывы</p>
            <h2 className="font-heading text-3xl md:text-4xl text-charcoal">
              Слова наших клиентов
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="bg-white rounded-3xl p-8 shadow-ambient"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <span key={j} className="text-sage text-lg">&#9733;</span>
                  ))}
                </div>
                <p className="font-body text-sm text-charcoal-light leading-relaxed mb-6 italic">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div>
                  <p className="font-body font-semibold text-sm text-charcoal">{review.name}</p>
                  <p className="font-body text-xs text-outline">{review.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
