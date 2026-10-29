import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { FaXmark } from "react-icons/fa6";

type Props = {
  mobileFilterOpen: boolean;
  setMobileFilterOpen: Dispatch<SetStateAction<boolean>>;
};

type ProductFilters = {
  category: string;
  gender: string;
  color: string;
  size: string[];
  material: string[];
  brand: string[];
  minPrice: number;
  maxPrice: number;
};

const FilterSidebar = ({ mobileFilterOpen, setMobileFilterOpen }: Props) => {
  const closeFilter = () => setMobileFilterOpen(false);
  const [searchParams, setSearchParams] = useState([]);
  const [filters, setFilters] = useState<ProductFilters>({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100,
  });
  const [priceRange, setPriceRange] = useState([0, 100]);
  const categories = ["Top wear", "Bottom wear"];
  const sizes: string[] = ["XS", "S", "M", "L", "XL", "XXL"];

  const colors: string[] = [
    "Black",
    "White",
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Gray",
    "Orange",
    "Pink",
    "Brown",
    "Purple",
  ];

  const genders: string[] = ["Men", "Women", "Unisex"];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice ? Number(params.minPrice) : 0,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : 100,
    });

    setPriceRange([
      params.minPrice ? Number(params.minPrice) : 0,
      params.maxPrice ? Number(params.maxPrice) : 100,
    ]);
  }, [searchParams]);
  return (
    <>
      {/* Background overlay (mobile only) */}
      <div
        aria-hidden="true"
        onClick={closeFilter}
        className={`fixed inset-0 z-60 bg-black/50 backdrop-blur-sm
          transition-opacity duration-300 ease-out md:hidden
          ${
            mobileFilterOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
      />

      {/* Left drawer on mobile / Fixed left-side panel on tablet & computer */}
      <aside
        id="filter-sidebar"
        aria-label="Product filters"
        className={`fixed inset-y-0 left-0 z-61 flex h-dvh w-80 max-w-[85%] flex-col overflow-y-auto bg-black p-6 text-white shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none md:static md:z-auto md:h-auto md:w-64 md:shrink-0 md:translate-x-0 md:overflow-visible md:bg-transparent md:p-0 md:text-white md:shadow-none ${
          mobileFilterOpen
            ? "translate-x-0"
            : "-translate-x-full pointer-events-none md:pointer-events-auto"
        }`}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold">Filters</h2>

          {/* Close button (only on mobile) */}
          <button
            type="button"
            aria-label="Close filters"
            onClick={closeFilter}
            tabIndex={mobileFilterOpen ? 0 : -1}
            className="rounded-full p-2 transition-colors hover:bg-gray-100 md:hidden"
          >
            <FaXmark size={20} />
          </button>
        </div>

        {/* Category */}
        <div className="mb-6">
          <h3 className="mb-4 border-b border-gray-200 pb-2 text-xs font-bold uppercase tracking-wider md:border-neutral-800">
            Category
          </h3>
          {categories.map((item) => (
            <div key={item} className="flex justify-start items-center gap-2">
              <input type="checkbox" className="cursor-pointer"/>
              <span>{item}</span>
            </div>

          ))}
        </div>

        {/* Size */}
        <div className="mb-6">
          <h3 className="mb-4 border-b border-gray-200 pb-2 text-xs font-bold uppercase tracking-wider md:border-neutral-800">
            Category
          </h3>
          {sizes.map((item) => (
            <div key={item} className="flex justify-start items-center gap-2">
              <input type="checkbox" className="cursor-pointer"/>
              <span>{item}</span>
            </div>

          ))}
        </div>

        {/* Color */}
        <div className="mb-6">
          <h3 className="mb-4 border-b border-gray-200 pb-2 text-xs font-bold uppercase tracking-wider md:border-neutral-800">
            Color
          </h3>

          <div className="flex flex-wrap gap-2">{/* colors options */}</div>
        </div>

        {/* Price */}
        <div>
          <h3 className="mb-4 border-b border-gray-200 pb-2 text-xs font-bold uppercase tracking-wider md:border-neutral-800">
            Price
          </h3>

          <input
            type="range"
            min="0"
            max="50000"
            aria-label="Maximum product price"
            className="w-full accent-orange-500"
          />
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
