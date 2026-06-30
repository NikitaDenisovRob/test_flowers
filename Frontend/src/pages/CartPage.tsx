import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ArrowRight, ChevronLeft, ShoppingBag } from 'lucide-react'
import { useState, type ChangeEvent } from 'react'
import { useCart } from '../context/CartContext'
import Footer from '../components/Footer'

interface CheckoutForm {
  name: string
  phone: string
  email: string
  address: string
  city: string
  zip: string
  comment: string
}

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()
  const [ordered, setOrdered] = useState(false)
  const [form, setForm] = useState<CheckoutForm>({ name: '', phone: '', email: '', address: '', city: '', zip: '', comment: '' })

  const setField = (field: keyof CheckoutForm) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const canOrder = ['name', 'phone', 'email', 'address', 'city'].every(
    f => form[f as keyof CheckoutForm].trim() !== ''
  )

  if (ordered) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-8 h-8 text-sage" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl text-charcoal mb-4">
            Заказ оформлен
          </h1>
          <p className="font-body text-sm text-outline mb-10 leading-relaxed">
            Наш флорист свяжется с вами в течение 15 минут для подтверждения деталей.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-charcoal text-white font-body font-semibold text-sm tracking-widest uppercase px-8 py-4 rounded-full hover:bg-charcoal-light transition-colors"
          >
            На главную
          </Link>
        </motion.div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-8 h-8 text-outline-variant" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl text-charcoal mb-4">
            Корзина пуста
          </h1>
          <p className="font-body text-sm text-outline mb-10">
            Откройте для себя нашу коллекцию
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 bg-charcoal text-white font-body font-semibold text-sm tracking-widest uppercase px-8 py-4 rounded-full hover:bg-charcoal-light transition-colors"
          >
            Перейти в каталог <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    )
  }

  const delivery = totalPrice >= 10000 ? 0 : 500
  const total = totalPrice + delivery

  return (
    <div className="bg-surface min-h-screen">
      {/* Header */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 pt-24 md:pt-32 pb-8">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-1.5 font-body text-xs text-outline hover:text-charcoal transition-colors mb-6 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Продолжить покупки
        </Link>
        <h1
          className="font-heading text-3xl md:text-5xl text-charcoal"
          style={{ letterSpacing: '-0.02em' }}
        >
          Корзина
        </h1>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 md:px-16 pb-20 md:pb-32 grid lg:grid-cols-3 gap-8 md:gap-12">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map(({ product, quantity }) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, height: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-surface-container-lowest rounded-3xl p-5 shadow-ambient flex gap-5"
              >
                {/* Image */}
                <Link to={`/product/${product.id}`}>
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-heading text-base md:text-lg text-charcoal hover:text-charcoal-light transition-colors cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="font-body text-xs text-outline mt-0.5">{product.subtitle}</p>
                    <p className="font-body font-semibold text-sm text-charcoal mt-2">
                      {(product.price * quantity).toLocaleString('ru-RU')} ₽
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-8 h-8 rounded-full border border-outline flex items-center justify-center hover:border-charcoal transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3 text-outline" />
                      </button>
                      <span className="font-body font-semibold text-sm text-charcoal w-5 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-8 h-8 rounded-full border border-outline flex items-center justify-center hover:border-charcoal transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-outline" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-2 hover:bg-error-container rounded-xl transition-colors cursor-pointer"
                      aria-label="Удалить"
                    >
                      <Trash2 className="w-4 h-4 text-outline-variant hover:text-error transition-colors" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={clearCart}
            className="font-body text-xs text-outline-variant hover:text-error transition-colors cursor-pointer mt-2"
          >
            Очистить корзину
          </button>
        </div>

        {/* Summary + Checkout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="lg:col-span-1 flex flex-col gap-4"
        >
          {/* Итого */}
          <div className="flex justify-between font-body text-sm px-1">
            <span className="text-outline">Подытог ({items.reduce((s, i) => s + i.quantity, 0)} шт.)</span>
            <span className="text-charcoal">{totalPrice.toLocaleString('ru-RU')} ₽</span>
          </div>
          <div className="flex justify-between font-body text-sm px-1">
            <span className="text-outline">Доставка</span>
            <span className={delivery === 0 ? 'text-primary font-medium' : 'text-charcoal'}>
              {delivery === 0 ? 'Бесплатно' : `${delivery} ₽`}
            </span>
          </div>
          {delivery > 0 && (
            <p className="font-body text-xs text-outline-variant px-1">Бесплатно от 10 000 ₽</p>
          )}
          <div className="flex justify-between items-baseline border-t border-outline-variant/30 pt-4 px-1">
            <span className="font-heading text-2xl text-charcoal">К оплате</span>
            <span className="font-heading text-2xl text-charcoal">{total.toLocaleString('ru-RU')} ₽</span>
          </div>

          {/* Delivery Details card */}
          <div className="bg-surface-container rounded-3xl p-7 mt-2">
            <h2 className="font-heading text-2xl text-primary mb-6">Данные доставки</h2>

            <div className="flex flex-col gap-5">
              {/* Email */}
              <div>
                <p className="font-body text-sm font-semibold text-charcoal mb-1">Email</p>
                <input type="email" value={form.email} onChange={setField('email')}
                  className="w-full font-body text-sm text-primary bg-transparent outline-none placeholder:text-primary/50"
                  placeholder="your@email.com" />
              </div>
              {/* Phone */}
              <div>
                <p className="font-body text-sm font-semibold text-charcoal mb-1">Телефон</p>
                <input type="tel" value={form.phone} onChange={setField('phone')}
                  className="w-full font-body text-sm text-primary bg-transparent outline-none placeholder:text-primary/50"
                  placeholder="+7 (___) ___-__-__" />
              </div>
              {/* Divider */}
              <div className="border-t border-outline-variant/30" />
              {/* Recipient */}
              <div>
                <p className="font-body text-sm font-semibold text-charcoal mb-1">Имя получателя</p>
                <input type="text" value={form.name} onChange={setField('name')}
                  className="w-full font-body text-sm text-primary bg-transparent outline-none placeholder:text-primary/50"
                  placeholder="Иван Иванов" />
              </div>
              {/* Address */}
              <div>
                <p className="font-body text-sm font-semibold text-charcoal mb-1">Адрес доставки</p>
                <input type="text" value={form.address} onChange={setField('address')}
                  className="w-full font-body text-sm text-primary bg-transparent outline-none placeholder:text-primary/50"
                  placeholder="ул. Пушкина, д. 10, кв. 5" />
              </div>
              {/* City + ZIP */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-body text-sm font-semibold text-charcoal mb-1">Город</p>
                  <input type="text" value={form.city} onChange={setField('city')}
                    className="w-full font-body text-sm text-primary bg-transparent outline-none placeholder:text-primary/50"
                    placeholder="Москва" />
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-charcoal mb-1">Индекс</p>
                  <input type="text" value={form.zip} onChange={setField('zip')}
                    className="w-full font-body text-sm text-primary bg-transparent outline-none placeholder:text-primary/50"
                    placeholder="101000" />
                </div>
              </div>
            </div>

            <button
              onClick={() => { clearCart(); setOrdered(true) }}
              disabled={!canOrder}
              className={`w-full flex items-center justify-center gap-2 mt-8 py-4 rounded-full font-jost font-semibold text-sm tracking-widest uppercase transition-colors ${
                canOrder
                  ? 'bg-charcoal text-white cursor-pointer hover:bg-charcoal-light'
                  : 'bg-outline-variant/30 text-outline-variant cursor-not-allowed'
              }`}
            >
              Оформить заказ
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
