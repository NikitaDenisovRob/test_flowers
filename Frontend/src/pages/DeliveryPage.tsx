import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import Footer from '../components/Footer'

const deliveryZones = [
  { zone: 'Центр', time: '1–2 часа', price: 'Бесплатно от 10 000 ₽ / 500 ₽' },
  { zone: 'В пределах МКАД', time: '2–4 часа', price: 'Бесплатно от 15 000 ₽ / 800 ₽' },
  { zone: 'За МКАД (до 20 км)', time: '3–5 часов', price: '1 200 ₽' },
]

const paymentMethods = [
  { title: 'Банковская карта', desc: 'Visa, Mastercard, МИР — онлайн при оформлении заказа.' },
  { title: 'СБП', desc: 'Оплата по QR-коду через приложение банка. Мгновенное подтверждение.' },
  { title: 'Наличные', desc: 'При самовывозе или курьерской доставке.' },
]

export default function DeliveryPage() {
  return (
    <div className="bg-surface min-h-screen">
      <div className="max-w-[800px] mx-auto px-5 md:px-8 pt-24 md:pt-32 pb-20 md:pb-32">

        {/* Back */}
        <Link to="/catalog" className="inline-flex items-center gap-1.5 font-body text-xs text-outline hover:text-charcoal transition-colors mb-10">
          <ChevronLeft className="w-3.5 h-3.5" />
          Коллекция
        </Link>

        <h1 className="font-heading text-4xl md:text-5xl text-charcoal mb-3" style={{ letterSpacing: '-0.02em' }}>
          Доставка и оплата
        </h1>
        <p className="font-body text-sm text-outline mb-16 leading-relaxed">
          Доставляем по Москве ежедневно с 9:00 до 22:00, включая праздники.
        </p>

        {/* Доставка */}
        <section className="mb-16">
          <h2 className="font-heading text-2xl text-charcoal mb-8">Доставка</h2>

          {/* Zones table */}
          <div className="rounded-2xl overflow-hidden border border-outline-variant/30 mb-10">
            <div className="grid grid-cols-3 px-5 py-3 bg-surface-container">
              <span className="label-caps text-outline-variant">Зона</span>
              <span className="label-caps text-outline-variant">Время</span>
              <span className="label-caps text-outline-variant">Стоимость</span>
            </div>
            {deliveryZones.map((z, i) => (
              <div key={z.zone} className={`grid grid-cols-3 px-5 py-4 ${i < deliveryZones.length - 1 ? 'border-b border-outline-variant/20' : ''}`}>
                <span className="font-body text-sm text-charcoal">{z.zone}</span>
                <span className="font-body text-sm text-charcoal-light">{z.time}</span>
                <span className="font-body text-sm text-charcoal-light">{z.price}</span>
              </div>
            ))}
          </div>

          {/* Самовывоз */}
          <div className="border-t border-outline-variant/30 pt-8">
            <h3 className="font-body text-sm font-semibold text-charcoal mb-2">Самовывоз</h3>
            <p className="font-body text-sm text-charcoal-light leading-relaxed">
              Ежедневно с 9:00 до 21:00. Адрес точки выдачи вы получите в подтверждении заказа.
              Букет будет готов в течение 2 часов после оформления.
            </p>
          </div>
        </section>

        {/* Оплата */}
        <section className="mb-16">
          <h2 className="font-heading text-2xl text-charcoal mb-8">Оплата</h2>
          <div className="flex flex-col divide-y divide-outline-variant/20 border-y border-outline-variant/30">
            {paymentMethods.map(m => (
              <div key={m.title} className="py-6">
                <p className="font-body text-sm font-semibold text-charcoal mb-1">{m.title}</p>
                <p className="font-body text-sm text-charcoal-light leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Упаковка */}
        <section>
          <h2 className="font-heading text-2xl text-charcoal mb-4">Упаковка</h2>
          <p className="font-body text-sm text-charcoal-light leading-relaxed">
            Все букеты упаковываются в фирменную крафт-бумагу и доставляются в специальных боксах,
            которые поддерживают оптимальную влажность и защищают цветы в дороге.
            Подарочное оформление — бесплатно.
          </p>
        </section>

      </div>
      <Footer />
    </div>
  )
}
