import { useState } from "react";
import {
  FaFilter,
} from "react-icons/fa6";

import FilterSidebar from "../components/products/FilterSidebar";
import SortProduct from "../components/products/SortProduct";

const Collection = () => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // FILTER STATES
  //   const [selectedCategory, setSelectedCategory] = useState("All");
  //   const [selectedSize, setSelectedSize] = useState(null);
  //   const [selectedColor, setSelectedColor] = useState(null);
  //   const [price, setPrice] = useState(50000);
  //   const [sortBy, setSortBy] = useState("newest");

  return (
    <div className="min-h-screen text-slate-900">
      {/* HEADER */}
      <header className="max-w-7xl mx-auto px-4 py-2 border-b border-slate-100">
        <p className="text-[20px] uppercase tracking-[0.3em] text-slate-400">
          Collections
        </p>
        <div className="flex gap-4 items-center justify-between mt-4 ">
          <button
            className="lg:hidden border p-2"
            onClick={() => setMobileFilterOpen(true)}
          >
            <FaFilter />
          </button>

         <SortProduct/>
        </div>
      </header>

      {/* MOBILE FILTER */}
      
        <FilterSidebar
          mobileFilterOpen={mobileFilterOpen}
          setMobileFilterOpen={setMobileFilterOpen}
        />
    </div>
  );
};

export default Collection;
