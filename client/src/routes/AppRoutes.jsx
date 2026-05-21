import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'


import Register from '../pages/Register'
import Login from '../pages/Login'
import Home from '../pages/Home'
import ProductList from '../pages/ProductList'
import ProductDetail from '../pages/ProductDetail'
import NotFound from '../pages/NotFound'


import Cart from '../pages/Cart'
import Wishlist from '../pages/Wishlist'
import Checkout from '../pages/Checkout'
import OrderSuccess from '../pages/OrderSuccess'
import Profile from "../pages/Profile";


import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../pages/AdminDashboard'
import AdminProducts from '../pages/AdminProducts'
import AdminOrders from '../pages/AdminOrders'
import AdminUsers from '../pages/AdminUsers'


function AppRoutes() {
  return (
    <Routes>
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />

      <Route path='/' element={
        <ProtectedRoute noAdminAccess={true}>
          <Home />
        </ProtectedRoute>
      } />

      <Route path='/products' element={
        <ProtectedRoute noAdminAccess={true}>
          <ProductList />
        </ProtectedRoute>
      } />

      <Route path='/products/:id/:slug' element={
        <ProtectedRoute noAdminAccess={true}>
          <ProductDetail />
        </ProtectedRoute>
      } />


      <Route path='/cart' element={
        <ProtectedRoute userOnly={true}>
          <Cart />
        </ProtectedRoute>
      } />

      <Route path='/wishlist' element={
        <ProtectedRoute userOnly={true}>
          <Wishlist />
        </ProtectedRoute>
      } />

      <Route path='/checkout' element={
        <ProtectedRoute userOnly={true}>
          <Checkout />
        </ProtectedRoute>
      } />

      <Route path='/order-success' element={
        <ProtectedRoute userOnly={true}>
          <OrderSuccess />
        </ProtectedRoute>
      } />


      <Route path="/profile" element={
        <ProtectedRoute >
          <Profile />
        </ProtectedRoute>
      } />



      <Route path='/admin' element={
        <ProtectedRoute adminOnly={true}>
          <AdminLayout />
        </ProtectedRoute>
      }>

        {/* Default Dashboard */}
        <Route index element={<AdminDashboard />} />

        <Route path='products' element={<AdminProducts />} />
        <Route path='orders' element={<AdminOrders />} />
        <Route path='users' element={<AdminUsers />} />

      </Route>



      <Route path='*' element={<NotFound />} />


    </Routes>
  )
}

export default AppRoutes
