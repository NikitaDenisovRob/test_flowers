import { Link } from 'react-router-dom'
import { shopInfo } from '../data/mock'

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-16">
          {/* Brand */}
          <div>
            <p className="font-heading text-2xl mb-4">L'Art de Fleur</p>
            <p className="font-body text-sm text-white/50 leading-relaxed max-w-xs">
              {shopInfo.description}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="label-caps text-sage mb-6">Навигация</p>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Главная' },
                { to: '/catalog', label: 'Коллекция' },
                { to: '/catalog?cat=author', label: 'Авторские' },
                { to: '/cart', label: 'Корзина' },
              ].map(l => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="font-body text-sm text-white/50 hover:text-white transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="label-caps text-sage mb-6">Контакты</p>
            <ul className="space-y-3 font-body text-sm text-white/50">
              <li>{shopInfo.phone}</li>
              <li>{shopInfo.email}</li>
              <li>{shopInfo.address}</li>
              <li>{shopInfo.hours}</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-body text-xs text-white/30">
            &copy; {new Date().getFullYear()} L'Art de Fleur. Все права защищены.
          </p>
          <p className="label-caps text-white/20 text-[10px]">
            Quiet Luxury
          </p>
        </div>
      </div>
    </footer>
  )
}
