import { Route, Routes } from "react-router-dom";
import UserLayout from "./components/layout/UserLayout";
import Home from "./pages/Home";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import Collection from "./pages/Collection";
import ProductDetails from "./components/products/ProductDetails";
import Checkout from "./components/cart/Checkout.";
import OrderConfirmation from "./pages/OrderConfirmation";
import AdminLayout from "./components/admin/AdminLayout";
import AdminHomepage from "./pages/AdminHomepage";
import UsersManagement from "./components/admin/UsersManagement";
import ProductManagement from "./components/admin/ProductManagement";
import EditProduct from "./components/admin/EditProduct";

const App = () => {
  return (
    <>
      <Toaster position="top-right" duration={1000} />
      <Routes>
        <Route path="/" element={<UserLayout />}>
          {/*User layout */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="collections/:collection" element={<Collection />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-confirmation" element={<OrderConfirmation />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          {/* Admin pages will be added to these routes later. */}
          <Route index element={<AdminHomepage />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="products" element={<ProductManagement/>} />
          <Route path="products/:id/edit" element={<EditProduct />} />
          <Route path="shop" />
        </Route>
      </Routes>
    </>
  );
};

export default App;
