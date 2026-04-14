import { Route,Routes } from 'react-router-dom'
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


import AdminDashboard from '../pages/AdminDashboard'
import AdminProducts from '../pages/AdminProducts'
import AdminOrders from '../pages/AdminOrders'
import AdminUsers from '../pages/AdminUsers'


function AppRoutes() {
  return (
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/products' element={<ProductList/>} />
        <Route path='/products/:id/:slug' element={<ProductDetail/>} />


        <Route path='/cart' element={
          <ProtectedRoute>
            <Cart/>
          </ProtectedRoute>
        } />

        <Route path='/wishlist' element={
          <ProtectedRoute>
            <Wishlist/>
          </ProtectedRoute>
        } />

        <Route path='/checkout' element={
          <ProtectedRoute>
            <Checkout/>
          </ProtectedRoute>
        } />

        <Route path='/order-success' element={
          <ProtectedRoute>
            <OrderSuccess/>
          </ProtectedRoute>
        } />


        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />



        <Route path='/admin' element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard/>
          </ProtectedRoute>
        } />

        <Route path='/admin/products' element={
          <ProtectedRoute adminOnly={true}>
            <AdminProducts />
          </ProtectedRoute>
        } />

        <Route path='/admin/orders' element={
          <ProtectedRoute adminOnly={true}>
            <AdminOrders/>
          </ProtectedRoute>
        } />

        <Route path='/admin/users' element={
          <ProtectedRoute adminOnly={true}>
            <AdminUsers/>
          </ProtectedRoute>
        } />



        <Route path='*' element={<NotFound/>} />


      </Routes>
  )
}

export default AppRoutes
