import { Routes, Route } from 'react-router-dom'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Catalog />} />
      <Route path="/produto/:id" element={<ProductDetail />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/*" element={<Admin />} />
    </Routes>
  )
}
