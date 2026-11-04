import {
  Check,
  Package,
  Truck,
  MapPin,
  CreditCard,
  ArrowRight,
  ShoppingBag,
  CalendarDays,
} from "lucide-react";
import { Link } from "react-router-dom";

const order = {
  orderId: "NX-20261103-001",
  date: "November 3, 2026",
  estimatedDelivery: "November 7 - November 9, 2026",
  paymentMethod: "Cash on Delivery",
  paymentStatus: "Pending",
  shippingAddress: {
    name: "Nazmul Islam",
    address: "House 12, Road 5",
    city: "Chittagong",
    postalCode: "4000",
    country: "Bangladesh",
    phone: "+880 1XXXXXXXXX",
  },
  products: [
    {
      id: "1",
      name: "Stylish Jacket",
      size: "M",
      color: "Black",
      price: 120,
      quantity: 1,
      image: "/images/stylish-jacket.jpg",
    },
    {
      id: "2",
      name: "Casual Hoodie",
      size: "L",
      color: "Gray",
      price: 80,
      quantity: 1,
      image: "/images/casual-hoodie.jpg",
    },
  ],
  subtotal: 200,
  shipping: 0,
  total: 200,
};

const OrderConfirmation = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full border border-green-500/30 bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <Check size={38} className="text-green-500" />
          </div>

          <p className="text-sm uppercase tracking-[3px] text-green-500 mb-3">
            Order Confirmed
          </p>

          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Thank You for Your Order!
          </h1>

          <p className="text-gray-500 text-sm mt-4 max-w-lg mx-auto leading-relaxed">
            Your order has been successfully placed. We will notify you once
            your items are on their way.
          </p>
        </div>

        {/* Order Information */}
        <div className="border border-gray-800 rounded-lg p-5 sm:p-7 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Order Number
              </p>
              <p className="text-sm font-medium">#{order.orderId}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Order Date
              </p>
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays size={16} className="text-gray-500" />
                {order.date}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Estimated Delivery
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Truck size={16} className="text-gray-500" />
                {order.estimatedDelivery}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side */}
          <div className="lg:col-span-7 space-y-8">
            {/* Ordered Products */}
            <section className="border border-gray-800 rounded-lg p-5 sm:p-7">
              <div className="flex items-center gap-3 mb-6">
                <Package size={20} />
                <h2 className="text-lg font-medium">Ordered Items</h2>
              </div>

              <div className="space-y-6">
                {order.products.map((product) => (
                  <div key={product.id} className="flex gap-4">
                    <div className="w-20 h-24 bg-[#151515] rounded-md overflow-hidden shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium">{product.name}</h3>

                      <p className="text-xs text-gray-500 mt-2">
                        Size: {product.size}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Color: {product.color}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Quantity: {product.quantity}
                      </p>
                    </div>

                    <p className="text-sm font-medium">
                      ${(product.price * product.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Shipping Address */}
            <section className="border border-gray-800 rounded-lg p-5 sm:p-7">
              <div className="flex items-center gap-3 mb-6">
                <MapPin size={20} />
                <h2 className="text-lg font-medium">Shipping Address</h2>
              </div>

              <div className="text-sm text-gray-400 space-y-2">
                <p className="text-white font-medium">
                  {order.shippingAddress.name}
                </p>

                <p>{order.shippingAddress.address}</p>

                <p>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}
                </p>

                <p>{order.shippingAddress.country}</p>

                <p className="pt-2">Phone: {order.shippingAddress.phone}</p>
              </div>
            </section>
          </div>

          {/* Right Side */}
          <div className="lg:col-span-5">
            <div className="border border-gray-800 rounded-lg p-5 sm:p-7 lg:sticky lg:top-8">
              <h2 className="text-lg font-medium mb-6">Order Summary</h2>

              {/* Payment */}
              <div className="flex items-center justify-between pb-5 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <CreditCard size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm">Payment Method</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-yellow-500">
                  {order.paymentStatus}
                </span>
              </div>

              {/* Price Details */}
              <div className="space-y-4 py-6 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>
                    {order.shipping === 0
                      ? "Free"
                      : `$${order.shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-5 flex justify-between items-center">
                <span className="font-medium">Total Paid</span>
                <span className="text-2xl font-semibold">
                  ${order.total.toFixed(2)}
                </span>
              </div>

              {/* Buttons */}
              <div className="mt-8 space-y-3">
                <Link
                  to="/collections/all"
                  className="flex items-center justify-center gap-2 w-full bg-white text-black py-4 rounded-md text-sm font-semibold uppercase tracking-wider hover:bg-gray-200 transition"
                >
                  <ShoppingBag size={17} />
                  Continue Shopping
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/orders"
                  className="flex items-center justify-center w-full border border-gray-700 py-4 rounded-md text-sm font-medium hover:bg-white hover:text-black transition"
                >
                  View My Orders
                </Link>
              </div>

              <p className="text-xs text-gray-600 text-center mt-6 leading-relaxed">
                Need help with your order? Contact our support team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
