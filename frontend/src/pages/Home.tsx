import Hero from "../components/layout/Hero";
import GenderCollectionSection from "../components/products/GenderCollectionSection";
import NewArrivals from "../components/products/NewArrivals";
import ProductDetails from "../components/products/ProductDetails";
import ProductGrid from "../components/products/ProductGrid";
import {products} from "../../public/data/products.js" 


const Home = () => {
  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />
      <ProductDetails />
      <div className="py-8  md:py-16 md:px-4 bg-black text-white">
        <h2 className="text-3xl font-bold px-4 md:px-24 flex mb-8 md:mb-18 justify-center items-center lg:px-24 bg-black text-white">
          You may also <span className="text-orange-500 ">Like</span>
        </h2>
        <ProductGrid products={products}/>
      </div>
    </div>
  );
};

export default Home;
