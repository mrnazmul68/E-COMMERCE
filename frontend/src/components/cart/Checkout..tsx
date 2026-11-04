import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowLeft,
  LockKeyhole,
  Truck,
  CreditCard,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { Link } from "react-router-dom";

const cart = {
  products: [
    {
      name: "Stylish Jacket",
      size: "M",
      color: "Black",
      price: 120,
      image: "/images/stylish-jacket.jpg",
      quantity: 1,
    },
    {
      name: "Casual Hoodie",
      size: "L",
      color: "Gray",
      price: 80,
      image: "/images/casual-hoodie.jpg",
      quantity: 1,
    },
  ],
  totalPrice: 200,
};

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

const initialState: ShippingAddress = {
  firstName: "",
  lastName: "",
  email: "mrnazmul68@gamil.com",
  address: "",
  city: "",
  postalCode: "",
  country: "",
  phone: "",
};

const Checkout = () => {
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress>(initialState);

  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({
      shippingAddress,
      paymentMethod,
      cart,
    });
  };

  const inputClass =
    "w-full bg-[#111] border border-gray-800 rounded-md px-4 py-3 text-sm text-white outline-none transition focus:border-white placeholder:text-gray-600";

  const labelClass = "block text-sm text-gray-400 mb-2";

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <Link
            to={"/cart"}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition mb-6"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </Link>

          <h1 className="text-3xl md:text-4xl font-semibold uppercase tracking-tight">
            Checkout
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            Complete your order by providing your details below.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Side */}
            <div className="lg:col-span-7 space-y-8">
              {/* Contact Details */}
              <section className="border border-gray-800 rounded-lg p-5 sm:p-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                    <ShoppingBag size={17} />
                  </div>

                  <div>
                    <h2 className="text-lg font-medium">Contact Details</h2>
                    <p className="text-xs text-gray-500">
                      Where can we reach you?
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingAddress.email}
                      disabled
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleChange}
                      placeholder="+880 1XXXXXXXXX"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section className="border border-gray-800 rounded-lg p-5 sm:p-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                    <Truck size={17} />
                  </div>

                  <div>
                    <h2 className="text-lg font-medium">Shipping Address</h2>
                    <p className="text-xs text-gray-500">
                      Enter your delivery information.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingAddress.firstName}
                      onChange={handleChange}
                      placeholder="First name"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingAddress.lastName}
                      onChange={handleChange}
                      placeholder="Last name"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleChange}
                      placeholder="House number and street name"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>City</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleChange}
                      placeholder="Your city"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleChange}
                      placeholder="Postal code"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>Country</label>
                    <input
                      type="text"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleChange}
                      placeholder="Bangladesh"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="border border-gray-800 rounded-lg p-5 sm:p-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                    <CreditCard size={17} />
                  </div>

                  <div>
                    <h2 className="text-lg font-medium">Payment Method</h2>
                    <p className="text-xs text-gray-500">
                      Choose how you want to pay.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-gray-800 rounded-md cursor-pointer hover:border-gray-500 transition">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-orange-500"
                    />
                    <CreditCard size={18} />
                    <span className="text-sm">Credit / Debit Card</span>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-gray-800 rounded-md cursor-pointer hover:border-gray-500 transition">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-orange-500"
                    />
                    <Truck size={18} />
                    <span className="text-sm">Cash on Delivery</span>
                  </label>
                </div>
              </section>
            </div>

            {/* Right Side - Order Summary */}
            <div className="lg:col-span-5">
              <div className="border border-gray-800 rounded-lg p-5 sm:p-7 lg:sticky lg:top-8">
                <h2 className="text-xl font-medium mb-6">Order Summary</h2>

                {/* Products */}
                <div className="space-y-5">
                  {cart.products.map((product) => (
                    <div key={product.name} className="flex gap-4">
                      <div className="relative w-20 h-24 shrink-0 bg-[#151515] rounded-md overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-gray-700 text-white text-xs flex items-center justify-center">
                          {product.quantity}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium">{product.name}</h3>

                        <p className="text-xs text-gray-500 mt-2">
                          Size: {product.size}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          Color: {product.color}
                        </p>
                      </div>

                      <p className="text-sm font-medium">
                        ${(product.price * product.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-800 my-6" />

                {/* Coupon */}
                <div className="flex gap-2 mb-6">
                  <div className="flex-1 relative">
                    <Tag
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="text"
                      placeholder="Discount code"
                      className="w-full bg-[#111] border border-gray-800 rounded-md pl-10 pr-3 py-3 text-sm outline-none focus:border-white"
                    />
                  </div>

                  <button
                    type="button"
                    className="px-5 bg-orange-500 text-white text-sm font-bold rounded-md hover:bg-black hover:border hover:border-white  hover:text-orange-500 transition"
                  >
                    Apply
                  </button>
                </div>

                {/* Price Details */}
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>${cart.totalPrice.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
                    <span className="text-base font-medium">Total</span>
                    <span className="text-xl font-semibold">
                      ${(cart.totalPrice).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Place Order */}
                <button
                  type="submit"
                  className="w-full mt-7 py-4 bg-orange-500 text-white font-semibold text-sm uppercase tracking-wider rounded-md hover:bg-black hover:border hover:border-white  hover:text-orange-500 transition"
                >
                  Place Order
                </button>

                <div className="flex items-center justify-center gap-2 mt-5 text-xs text-gray-500">
                  <LockKeyhole size={14} />
                  Secure Checkout
                </div>

                <p className="text-center text-xs text-gray-600 mt-4 leading-relaxed">
                  By placing your order, you agree to our Terms & Conditions and
                  Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
