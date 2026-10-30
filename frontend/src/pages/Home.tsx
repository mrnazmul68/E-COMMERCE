import Hero from "../components/layout/Hero";
import GenderCollectionSection from "../components/products/GenderCollectionSection";
import NewArrivals from "../components/products/NewArrivals";
import ProductDetails from "../components/products/ProductDetails";
import ProductGrid from "../components/products/ProductGrid";
import { products } from "../../public/data/products.js";

const Home = () => {
  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />
       <div className=" bg-black text-white pt-6">
        <h2 className="text-3xl font-bold flex  justify-center items-center bg-black text-white">
          You may also <span className="text-orange-500 ">Like</span>
        </h2>
        <ProductDetails/>
      </div>
      <div className="py-8  px-4 md:py-16 md:px-30 bg-black text-white">
        <h2 className="text-3xl font-bold px-4 md:px-24 flex mb-8 md:mb-18 justify-center items-center lg:px-24 bg-black text-white">
          You may also <span className="text-orange-500 ">Like</span>
        </h2>
        <ProductGrid products={products} cols={4} />
      </div>
    </div>
  );
};

export default Home;
