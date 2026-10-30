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
        </Route>
        {/* <Route path="/admin" element={<AdminLayout />} /> */}
      </Routes>
    </>
  );
};

export default App;
