import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Search, Sparkles, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { products, type Product } from '../data/mock'

interface Props {
  open: boolean
  onClose: () => void
  initialTab?: 'search' | 'neural'
}

type Message = {
  role: 'user' | 'assistant'
  text: string
  products?: Product[]
}

// ── Анимированный орб ────────────────────────────────
function NeuralOrb({ size = 72, thinking = false }: { size?: number; thinking?: boolean }) {
  const d = thinking ? 1.6 : 5.5
  const blur = Math.max(4, size * 0.11)

  return (
    <motion.div
      className="relative flex-shrink-0 overflow-hidden"
      style={{ width: size, height: size }}
      animate={{
        borderRadius: [
          '50% 42% 58% 42% / 42% 58% 42% 58%',
          '58% 42% 52% 48% / 58% 42% 58% 42%',
          '42% 58% 42% 58% / 52% 48% 58% 42%',
          '54% 46% 54% 46% / 46% 54% 46% 54%',
          '50% 42% 58% 42% / 42% 58% 42% 58%',
        ],
        scale: thinking ? [1, 1.1, 0.93, 1.07, 1] : [1, 1.025, 0.985, 1.015, 1],
      }}
      transition={{ duration: d, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Тёмная база */}
      <div style={{ position: 'absolute', inset: 0, background: '#080b14', borderRadius: 'inherit' }} />

      {/* Фиолетовое пятно */}
      <motion.div
        style={{
          position: 'absolute', width: '75%', height: '75%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
          filter: `blur(${blur}px)`,
        }}
        animate={{ x: ['-10%', '22%', '8%', '-10%'], y: ['-12%', '8%', '28%', '-12%'] }}
        transition={{ duration: d * 1.3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Синее пятно */}
      <motion.div
        style={{
          position: 'absolute', width: '70%', height: '70%',
          right: 0, bottom: 0,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)',
          filter: `blur(${blur}px)`,
        }}
        animate={{ x: ['0%', '-24%', '-6%', '0%'], y: ['0%', '-18%', '12%', '0%'] }}
        transition={{ duration: d * 0.85, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      />

      {/* Голубое пятно */}
      <motion.div
        style={{
          position: 'absolute', width: '55%', height: '55%',
          left: '22%', top: '22%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
          filter: `blur(${blur * 0.8}px)`,
          opacity: 0.75,
        }}
        animate={{ x: ['-8%', '18%', '-12%', '-8%'], y: ['6%', '-8%', '18%', '6%'] }}
        transition={{ duration: d * 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
      />

      {/* Розовый акцент */}
      <motion.div
        style={{
          position: 'absolute', width: '40%', height: '40%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)',
          filter: `blur(${blur * 0.7}px)`,
          opacity: 0.5,
          right: '10%', top: '10%',
        }}
        animate={{ x: ['0%', '-30%', '5%', '0%'], y: ['0%', '20%', '-15%', '0%'] }}
        transition={{ duration: d * 1.1, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
      />

      {/* Внешнее свечение */}
      <div
        style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit',
          boxShadow: thinking
            ? `0 0 ${size * 0.7}px rgba(124,58,237,0.65), 0 0 ${size * 1.3}px rgba(37,99,235,0.25)`
            : `0 0 ${size * 0.5}px rgba(124,58,237,0.45), 0 0 ${size}px rgba(37,99,235,0.15)`,
          transition: 'box-shadow 0.5s ease',
        }}
      />

      {/* Блик */}
      <div
        style={{
          position: 'absolute', top: '10%', left: '14%',
          width: '36%', height: '24%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.55) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }}
      />
    </motion.div>
  )
}

// ── Сценарии нейропоиска ─────────────────────────────
const SCENARIOS = [
  {
    keywords: ['день рождения', 'др ', 'юбилей', 'именины', 'birthday'],
    response: 'День рождения — особый повод. Выбирайте то, что оставит след: нежные пионы, роскошные розы David Austin или весенняя лёгкость пастельных оттенков.',
    productIds: ['1', '5', '7'],
  },
  {
    keywords: ['свадьба', 'невеста', 'свадебный', 'замужество', 'церемония'],
    response: 'Свадебная флористика требует безупречности. Вот наши самые торжественные композиции — созданные именно для того, чтобы запомниться навсегда.',
    productIds: ['8', '2'],
  },
  {
    keywords: ['романтика', 'романтич', 'свидание', 'признание', 'годовщина', 'девушке', 'жене', 'любов'],
    response: 'Романтика — это про детали. Розы David Austin с бархатными лепестками или лавандовые пионы скажут всё без единого слова.',
    productIds: ['5', '7', '2'],
  },
  {
    keywords: ['мама', 'маме', 'маму', 'матери', 'мамочке', '8 марта'],
    response: 'Маме — только самое нежное и тёплое. Букеты, которые выражают благодарность и любовь лучше любых слов.',
    productIds: ['1', '4', '7'],
  },
  {
    keywords: ['извинение', 'прости', 'прощение', 'помириться', 'извин'],
    response: 'Цветы говорят там, где слов недостаточно. Для искреннего жеста — белые и нежные тона, символизирующие чистоту намерений.',
    productIds: ['2', '4'],
  },
  {
    keywords: ['коллега', 'начальник', 'шеф', 'руководитель', 'деловой', 'офис', 'коллектив', 'партнёр'],
    response: 'Для делового подарка важна сдержанная элегантность. Эти композиции произведут впечатление без излишней пышности.',
    productIds: ['4', '2', '3'],
  },
  {
    keywords: ['весна', 'свежест', 'лёгк', 'воздушн', 'пастельн', 'нежн'],
    response: 'Весенние нежные букеты — про лёгкость и радость. Идеально, когда хочется просто подарить хорошее настроение.',
    productIds: ['1', '6', '7'],
  },
  {
    keywords: ['роскошь', 'роскошн', 'премиум', 'дорогой', 'шикарн', 'особенн', 'вау', 'wow'],
    response: 'Если нужен настоящий wow-эффект — вот наши самые роскошные авторские композиции. Те, что запомнятся.',
    productIds: ['8', '5', '3'],
  },
  {
    keywords: ['подруга', 'подруге', 'подружке', 'другу'],
    response: 'Подруге — что-то яркое и с характером, но при этом изысканное. Вот варианты, которые точно удивят.',
    productIds: ['1', '3', '6'],
  },
  {
    keywords: ['весёлый', 'яркий', 'радост', 'позитив', 'солнечн'],
    response: 'Когда хочется подарить солнечное настроение — эти букеты говорят сами за себя.',
    productIds: ['6', '1', '4'],
  },
]

const EXAMPLE_PROMPTS = [
  'День рождения подруги',
  'Романтическое свидание',
  'Извинение любимой',
  'Маме в подарок',
  'Деловой подарок',
  'Что-то роскошное',
]

function getAIResponse(query: string): { text: string; foundProducts: Product[] } {
  const lower = query.toLowerCase()
  for (const s of SCENARIOS) {
    if (s.keywords.some(kw => lower.includes(kw))) {
      return {
        text: s.response,
        foundProducts: products.filter(p => s.productIds.includes(p.id)),
      }
    }
  }
  return {
    text: 'Интересный запрос. Позвольте предложить несколько универсальных вариантов — они подойдут для большинства поводов:',
    foundProducts: [products[0], products[4], products[7]].filter(Boolean),
  }
}

// ── Компонент ────────────────────────────────────────
export default function SearchOverlay({ open, onClose, initialTab = 'search' }: Props) {
  const [tab, setTab] = useState<'search' | 'neural'>(initialTab)
  const [query, setQuery] = useState('')
  const [neuralInput, setNeuralInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const neuralInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const results = query.trim().length > 1
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
        p.fullDescription?.toLowerCase().includes(query.toLowerCase())
      )
    : []

  useEffect(() => {
    if (!open) {
      setQuery('')
      setNeuralInput('')
      setMessages([])
      setIsTyping(false)
      setTab(initialTab)
      return
    }
    if (tab === 'search') setTimeout(() => searchInputRef.current?.focus(), 100)
    else setTimeout(() => neuralInputRef.current?.focus(), 100)
  }, [open])

  useEffect(() => {
    if (!open) return
    if (tab === 'search') setTimeout(() => searchInputRef.current?.focus(), 80)
    else setTimeout(() => neuralInputRef.current?.focus(), 80)
  }, [tab])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleNeuralSubmit = (text: string) => {
    if (!text.trim() || isTyping) return
    setMessages(prev => [...prev, { role: 'user', text: text.trim() }])
    setNeuralInput('')
    setIsTyping(true)
    setTimeout(() => {
      const { text: aiText, foundProducts } = getAIResponse(text)
      setMessages(prev => [...prev, { role: 'assistant', text: aiText, products: foundProducts }])
      setIsTyping(false)
    }, 1100)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex flex-col"
        >
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(251,249,248,0.94)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
            onClick={onClose}
          />

          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 max-w-2xl w-full mx-auto px-5 flex flex-col"
            style={{ paddingTop: '80px', height: '100dvh' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center text-outline hover:text-charcoal transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Вкладки */}
            <div className="flex gap-0 border-b border-outline-variant/30 mb-6 flex-shrink-0">
              <button
                onClick={() => setTab('search')}
                className={`flex items-center gap-2 pb-3 pr-7 font-body text-sm cursor-pointer transition-colors border-b-2 -mb-px ${
                  tab === 'search' ? 'border-charcoal text-charcoal font-medium' : 'border-transparent text-outline hover:text-charcoal-light'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                Поиск
              </button>
              <button
                onClick={() => setTab('neural')}
                className={`flex items-center gap-2 pb-3 pr-7 font-body text-sm cursor-pointer transition-colors border-b-2 -mb-px ${
                  tab === 'neural' ? 'border-charcoal text-charcoal font-medium' : 'border-transparent text-outline hover:text-charcoal-light'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Нейропоиск
              </button>
            </div>

            {/* ── Поиск ── */}
            {tab === 'search' && (
              <div className="flex flex-col flex-1 min-h-0">
                <div className="flex items-center gap-4 border-b border-charcoal pb-4 flex-shrink-0">
                  <Search className="w-5 h-5 text-outline flex-shrink-0" />
                  <input
                    ref={searchInputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Найти букет..."
                    className="flex-1 font-heading text-charcoal bg-transparent outline-none placeholder:text-outline-variant"
                    style={{ fontSize: '1.5rem', letterSpacing: '-0.01em' }}
                  />
                </div>
                <div className="flex-1 overflow-y-auto pt-2">
                  <AnimatePresence>
                    {results.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 flex flex-col gap-2">
                        {results.map(p => (
                          <Link key={p.id} to={`/product/${p.id}`} onClick={onClose} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-surface-container transition-colors group">
                            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-heading text-base text-charcoal">{p.name}</p>
                              <p className="font-body text-xs text-outline mt-0.5">{p.subtitle}</p>
                            </div>
                            <p className="font-body text-sm font-semibold text-charcoal flex-shrink-0">{p.price.toLocaleString('ru-RU')} ₽</p>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {query.trim().length > 1 && results.length === 0 && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 font-body text-sm text-outline text-center">
                      Ничего не найдено по запросу «{query}»
                    </motion.p>
                  )}
                  {query.trim().length === 0 && (
                    <p className="mt-6 font-body text-xs text-outline-variant text-center">Начните вводить название букета</p>
                  )}
                </div>
              </div>
            )}

            {/* ── Нейропоиск ── */}
            {tab === 'neural' && (
              <div className="flex flex-col flex-1 min-h-0">
                <div className="flex-1 overflow-y-auto min-h-0">

                  {/* Начальный экран с орбом */}
                  <AnimatePresence>
                    {messages.length === 0 && !isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center pt-4 pb-6"
                      >
                        {/* Орб */}
                        <div className="mb-5">
                          <NeuralOrb size={80} thinking={false} />
                        </div>

                        <p className="font-body text-sm text-charcoal-light leading-relaxed text-center mb-5 max-w-xs">
                          Опишите повод, настроение или для кого букет — подберу подходящую композицию
                        </p>

                        <div className="flex flex-wrap gap-2 justify-center">
                          {EXAMPLE_PROMPTS.map(prompt => (
                            <button
                              key={prompt}
                              onClick={() => handleNeuralSubmit(prompt)}
                              className="px-4 py-2 rounded-full border border-outline-variant/40 font-body text-xs text-charcoal-light hover:border-charcoal hover:text-charcoal transition-colors cursor-pointer"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Сообщения */}
                  <div className="flex flex-col gap-6 pb-2">
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {msg.role === 'user' ? (
                          <div className="flex justify-end">
                            <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-tr-sm font-body text-sm text-white" style={{ background: '#1b1c1c' }}>
                              {msg.text}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <NeuralOrb size={24} thinking={false} />
                              <span className="font-body text-[11px] text-outline tracking-wide">Ассистент</span>
                            </div>
                            <p className="font-body text-sm text-charcoal leading-relaxed mb-4">{msg.text}</p>
                            {msg.products && msg.products.length > 0 && (
                              <div className="flex flex-col gap-2">
                                {msg.products.map(p => (
                                  <Link
                                    key={p.id}
                                    to={`/product/${p.id}`}
                                    onClick={onClose}
                                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-surface-container transition-colors"
                                    style={{ border: '0.5px solid rgba(0,0,0,0.07)' }}
                                  >
                                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-heading text-base text-charcoal">{p.name}</p>
                                      <p className="font-body text-xs text-outline mt-0.5">{p.subtitle}</p>
                                    </div>
                                    <p className="font-body text-sm font-semibold text-charcoal flex-shrink-0">{p.price.toLocaleString('ru-RU')} ₽</p>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {/* Печатает... */}
                    {isTyping && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
                        <NeuralOrb size={24} thinking={true} />
                        <div className="flex gap-1.5 px-4 py-3 rounded-2xl bg-surface-container">
                          {[0, 1, 2].map(i => (
                            <motion.div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-outline"
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div ref={chatEndRef} />
                </div>

                {/* Инпут */}
                <div
                  className="flex-shrink-0 pt-3 border-t border-outline-variant/25"
                  style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
                >
                  <form onSubmit={e => { e.preventDefault(); handleNeuralSubmit(neuralInput) }} className="flex items-center gap-3">
                    <input
                      ref={neuralInputRef}
                      value={neuralInput}
                      onChange={e => setNeuralInput(e.target.value)}
                      placeholder="Опишите повод или настроение..."
                      disabled={isTyping}
                      className="flex-1 font-body text-charcoal bg-transparent outline-none placeholder:text-outline-variant py-2 disabled:opacity-50"
                    />
                    <motion.button
                      type="submit"
                      disabled={!neuralInput.trim() || isTyping}
                      whileTap={{ scale: 0.9 }}
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed"
                      style={{ background: '#1b1c1c' }}
                    >
                      <Send className="w-3.5 h-3.5 text-white" />
                    </motion.button>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
