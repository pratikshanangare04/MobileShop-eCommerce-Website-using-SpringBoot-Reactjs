import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Login from './pages/Login';
import ProtectedRoute from './pages/ProtectedRoute';
import SignUp from './pages/SignUp';
import Navbar from './components/Navbar';

import UserDashboard from './components/UserDashboard'
import AdminDashboard from './components/AdminDashboard';
import CarouselComponent from './components/CarouselComponent';
import AdminProduct from './pages/AdminProduct';
import UserProduct from './pages/UserProduct';
import Cart from './components/Cart';
import PlaceOrder from './pages/PlaceOrder';
import OrderHistory from './pages/OrderHistory';
import ProductPage from './pages/ProductPage';


import ProductDetails from './pages/ProductDetails';

import OrderPlacePages from './pages/OrderPlacePages';
import UpdateUser from './components/UpdateProfile';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="*" element={<Navbar />} />
        <Route path="/signIn" element={<Login/>}/>
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute role="USER">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/signUp" element={<SignUp/>} />
        <Route path="/admin/products" element={<AdminProduct/>} />
        <Route path="/user/products" element={<UserProduct/>}/>
        <Route path="/cart" element={<Cart/>} />
        <Route path="user/update-profile" element={<UpdateUser/>}/>
        <Route path="/orders/place" element={<PlaceOrder/>} />
        <Route path="/orders/history" element={<OrderHistory/>} />
        <Route path="/user/product" element={<ProductPage/>}/>
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/order/place/submit" element={<OrderPlacePages/>}/>
      </Routes>
    </Router>
  );

 
}

export default App;
