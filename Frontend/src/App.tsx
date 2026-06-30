import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { CartProvider } from './context/CartContext'
import { CartAnimationProvider } from './context/CartAnimationContext'
import { ContactFloatProvider } from './context/ContactFloatContext'
import Navbar from './components/Navbar'
import MobileBottomNav from './components/MobileBottomNav'
import ContactFloat from './components/ContactFloat'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import DeliveryPage from './pages/DeliveryPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter basename="/test_flowers">
      <CartProvider>
      <CartAnimationProvider>
      <ContactFloatProvider>
        <ScrollToTop />
        <Navbar />
        <div className="pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/delivery" element={<DeliveryPage />} />
          </Routes>
        </div>
        <ContactFloat />
        <MobileBottomNav />
      </ContactFloatProvider>
      </CartAnimationProvider>
      </CartProvider>
    </BrowserRouter>
  )
}
