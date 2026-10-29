import { useState } from "react";
import { ShoppingCart, Minus, Plus, Check } from "lucide-react";
import { toast } from "sonner";

type ProductImage = {
  url: string;
  altText: string;
};

type Product = {
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  brand: string;
  material: string;
  sizes: string[];
  colors: string[];
  images: ProductImage[];
};

const product: Product = {
  name: "Stylish Jacket",
  price: 120,
  originalPrice: 150,
  description:
    "This is a stylish jacket perfect for any occasion, This is absolute good product, dont compare with other brnad with nexora. this is the brand of mati and manush of bangladesh ",
  brand: "FashionBrand",
  material: "Leather",
  sizes: ["S", "M", "L", "XL"],
  colors: ["Red", "Black"],
  images: [
    {
      url: "https://picsum.photos/500/500?random=1",
      altText: "Stylish Jacket 1",
    },
    {
      url: "https://picsum.photos/500/500?random=2",
      altText: "Stylish Jacket 2",
    },
    {
      url: "https://picsum.photos/500/500?random=3",
      altText: "Stylish Jacket 3",
    },
    {
      url: "https://picsum.photos/500/500?random=4",
      altText: "Stylish Jacket 4",
    },
  ],
};

const ProductDetails = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false)
  const discountPercentage =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0;
  const savings = product.originalPrice - product.price;


  const handleCart = ()=>{
    if(!selectedColor || !selectedSize){
      toast.error("Select color and size")
      return; 
    }

    setIsLoading(true)
    toast.info("Product added to cart")
    setIsLoading(false)
  }

  return (
    <section className="min-h-screen bg-black px-4 py-8 text-gray-50 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl flex justify-center items-center flex-col">
        <h2 className="text-4xl font-bold ">
          Best <span className="text-orange-500">seller</span>
        </h2>

        <div className="grid grid-cols-1 gap-8 rounded-2xl bg-black p-4 shadow-sm sm:p-6 lg:grid-cols-2 lg:gap-12 lg:p-10">
          {/* Product Image */}
          <div>
            {/* main image */}
            <div className="relative overflow-hidden rounded-xl bg-gray-100">
              <img
                src={product.images[selectedImageIndex].url}
                alt={product.images[selectedImageIndex].altText}
                className="h-90 w-full object-cover sm:h-120 lg:h-120"
              />
              {discountPercentage > 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1.5 text-sm font-bold text-white">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* mini image */}
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  aria-label={`Show ${image.altText}`}
                  aria-pressed={selectedImageIndex === index}
                  className={`overflow-hidden rounded-lg border-2 transition ${
                    selectedImageIndex === index
                      ? "border-orange-500"
                      : "border-transparent hover:border-orange-300"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.altText}
                    className="h-24 w-full object-cover sm:h-28"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="flex flex-col">
            <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
              Brand: {product.brand}
            </p>

            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-3xl font-bold text-orange-500">
                ৳{product.price.toLocaleString("en-BD")}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    ৳{product.originalPrice.toLocaleString("en-BD")}
                  </span>
                  <span className="w-full text-sm font-medium text-orange-400">
                    You save ৳{savings.toLocaleString("en-BD")} (
                    {discountPercentage}%)
                  </span>
                </>
              )}
            </div>

            <p className="mt-5 text-sm leading-7 text-gray-600 sm:text-base">
              {product.description}
            </p>

            <div className="my-6 border-t border-gray-100" />

            {/* Color Selection */}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Color:</h2>
                <span className="text-sm text-gray-500">{selectedColor}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    aria-label={color}
                    aria-pressed={selectedColor === color}
                    className={`flex  h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                      selectedColor === color
                        ? "border-gray-900"
                        : "border-transparent"
                    }`}
                  >
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10"
                      style={{ backgroundColor: color }}
                    >
                      {selectedColor === color && (
                        <Check
                          size={15}
                          className={
                            color === "Cream" ? "text-gray-900" : "text-white"
                          }
                        />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mt-6">
              <h2 className="text-sm font-semibold">
                Select Size:{" "}
                <span className="font-normal text-gray-500">
                  {selectedSize}
                </span>
              </h2>

              <div className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={selectedSize === size}
                    className={`flex h-11 items-center justify-center rounded-lg border text-sm font-medium transition ${
                      selectedSize === size
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 hover:border-gray-900"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Cart */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <div className="flex h-12 w-fit items-center rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="flex h-full w-11 items-center justify-center disabled:opacity-30"
                >
                  <Minus size={16} />
                </button>

                <span className="w-8 text-center text-sm font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.min(10, prev + 1))}
                  disabled={quantity >= 10}
                  aria-label="Increase quantity"
                  className="flex h-full w-11 items-center justify-center disabled:opacity-30"
                >
                  <Plus size={16} />
                </button>
              </div>
              {/* cart button */}
              <button
              onClick={handleCart}
                type="button"
                className="flex animate-bounce h-12 min-h-12 w-full shrink-0 flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 font-semibold text-white transition-colors hover:bg-orange-600 hover:animate-bounce active:animate-bounce active:scale-[0.98] sm:h-14 sm:min-h-14 sm:w-auto md:h-12 md:min-h-12"
              >
                <ShoppingCart size={19} />
                {isLoading ? "Adding...": "Add to cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
