import { useState } from "react";
import { FaFilter, FaList, FaTableCells } from "react-icons/fa6";

import FilterSidebar from "../components/products/FilterSidebar";
import SortProduct from "../components/products/SortProduct";
import Productgrid from "../components/products/ProductGrid";
import { products } from "../../public/data/products";

const Collection = () => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // FILTER STATES
  //   const [selectedCategory, setSelectedCategory] = useState("All");
  //   const [selectedSize, setSelectedSize] = useState(null);
  //   const [selectedColor, setSelectedColor] = useState(null);
  //   const [price, setPrice] = useState(50000);
  //   const [sortBy, setSortBy] = useState("newest");

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white">
      {/* HEADER */}
      <header className="max-w-7xl mx-auto px-4 py-2 border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
          <p className="text-[20px] uppercase tracking-[0.3em] text-slate-400">
            Collections
          </p>

          <div className="flex items-center justify-between md:justify-end gap-4">
            <button
              className="lg:hidden border p-2"
              onClick={() => setMobileFilterOpen(true)}
            >
              <FaFilter />
            </button>

            {/* sort products */}
            <div className="flex justify-center items-center gap-3">
              <SortProduct />
              <FaTableCells className="cursor-pointer" />
              <FaList className="cursor-pointer" />
            </div>
          </div>
        </div>
      </header>

      {/* Products */}
      <Productgrid products={products} />

      {/* MOBILE FILTER */}
      <FilterSidebar
        mobileFilterOpen={mobileFilterOpen}
        setMobileFilterOpen={setMobileFilterOpen}
      />
    </div>
  );
};

export default Collection;
