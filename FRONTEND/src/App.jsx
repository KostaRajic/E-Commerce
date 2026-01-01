import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Products } from './Navigates/Products'
import { MyProfile } from './components/MyProfile'
import { SingleProducts } from './Navigates/SingleProduct'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useContextAuth } from './context/Context'
import CartProduct from './Navigates/Cart'
import { Admin } from './Navigates/Admin'
import AddProduct from './Navigates/AddProduct'
// import  SignInModal  from './modals/SignIngModal'

function App() {
  const { theme } = useContextAuth()

  return (
    <div id={theme}>
      <BrowserRouter>

        <Routes>

          <Route element={<Layout />}>

            <Route index element={<Products />} />

            <Route
              path='/admin'
              element={<ProtectedRoute role='admin'><Admin /></ProtectedRoute>}
            />

            <Route
              path='/admin/add-product'
              element={<ProtectedRoute role='admin'><AddProduct /></ProtectedRoute>}
            />

            <Route path='/products' element={<Products />} />

            <Route path="/products/:productId" element={<SingleProducts />} />

            <Route
              path='/profile'
              element={<ProtectedRoute><MyProfile /></ProtectedRoute>}
            />

            <Route
              path='/cart'
              element={<ProtectedRoute><CartProduct /></ProtectedRoute>}
            />

          </Route>
        </Routes>

      </BrowserRouter>
    </div>
  )
}

export default App
