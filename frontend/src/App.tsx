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
import OrderManagement from "./components/admin/OrderManagement";
import AuthBootstrap from "./auth/AuthBootstrap";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { PublicOnlyRoute } from "./auth/PublicOnlyRoute";
import VerifyEmailPage from "./components/common/EmailVerification";
import GoogleAuthCallback from "./pages/GoogleAuthCallback";

const App = () => {
  return (
    <>
      <Toaster position="top-right" duration={2000} />

      <Routes>
        <Route element={<AuthBootstrap />}>
          {/*
           * Kept outside PublicOnlyRoute so the page can read the OAuth error
           * or returnTo before the authenticated redirect fires.
           */}
          <Route path="/auth/callback" element={<GoogleAuthCallback />} />

          <Route path="/" element={<UserLayout />}>
            {/* Public storefront */}
            <Route index element={<Home />} />
            <Route path="collections/:collection" element={<Collection />} />
            <Route path="product/:id" element={<ProductDetails />} />

            {/* Guests only */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="/token/:token" element={<VerifyEmailPage />} />
            </Route>

            {/* Signed-in customers */}
            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<MyOrders />} />
              <Route path="checkout" element={<Checkout />} />
              <Route
                path="order-confirmation"
                element={<OrderConfirmation />}
              />
            </Route>
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute adminOnly />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminHomepage />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="products/:id/edit" element={<EditProduct />} />
              <Route path="orders" element={<OrderManagement />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
