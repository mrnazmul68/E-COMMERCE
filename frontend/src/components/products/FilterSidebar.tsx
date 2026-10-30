import {
  useEffect,
  useState,
  type ChangeEvent,
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
} from "react";
import { FaXmark } from "react-icons/fa6";
import { useSearchParams } from "react-router-dom";

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

type FilterEvent =
  | ChangeEvent<HTMLInputElement>
  | MouseEvent<HTMLButtonElement>;

const FilterSidebar = ({ mobileFilterOpen, setMobileFilterOpen }: Props) => {
  const closeFilter = () => setMobileFilterOpen(false);

  const [searchParams, setSearchParams] = useSearchParams();

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

  const categories = ["Top wear", "Bottom wear"];
  const genders = ["Men", "Women", "Unisex"];

  const colors = [
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

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const materials = [
    "Cotton",
    "Polyester",
    "Denim",
    "Linen",
    "Silk",
    "Wool",
    "Nylon",
    "Leather",
  ];

  const brands = [
    "Nike",
    "Adidas",
    "Zara",
    "H&M",
    "Uniqlo",
    "Levi's",
    "Puma",
    "Gucci",
  ];

  // Read filters from URL
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());

    const minPrice = Number(params.minPrice ?? 0);
    const maxPrice = Number(params.maxPrice ?? 100);

    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: Number.isFinite(minPrice) ? minPrice : 0,
      maxPrice: Number.isFinite(maxPrice) ? maxPrice : 100,
    });
  }, [searchParams]);

  // Handle checkbox and button events
  const handleFilterChange = (e: FilterEvent) => {
    const target = e.currentTarget;
    const { name, value } = target;

    const newFilters = { ...filters };

    // Checkbox handling
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      if (name === "brand" || name === "material") {
        const key: "brand" | "material" = name;

        if (target.checked) {
          newFilters[key] = [...newFilters[key], value];
        } else {
          newFilters[key] = newFilters[key].filter((item) => item !== value);
        }
      } else if (name === "category") {
        newFilters.category = target.checked ? value : "";
      } else if (name === "gender") {
        newFilters.gender = target.checked ? value : "";
      }
    }

    // Button handling
    else if (target instanceof HTMLButtonElement) {
      if (name === "size") {
        // CHANGED: Removed unnecessary ArrayFilterKey type
        if (newFilters.size.includes(value)) {
          newFilters.size = newFilters.size.filter((item) => item !== value);
        } else {
          newFilters.size = [...newFilters.size, value];
        }
      } else if (name === "color") {
        newFilters.color = newFilters.color === value ? "" : value;
      }
    }

    // Price range handling
    else if (target instanceof HTMLInputElement && target.type === "range") {
      // CHANGED: Single slider only controls maxPrice
      newFilters.maxPrice = Number(value);
    }

    setFilters(newFilters);

    // Update URL after state calculation
    updateUrlParams(newFilters);
  };

  // Serialize selected filters into URL
  const updateUrlParams = (newFilters: ProductFilters) => {
    // CHANGED: Preserve existing query params
    const params = new URLSearchParams(searchParams);

    // ADDED: Remove previous filter params before updating
    const filterKeys: (keyof ProductFilters)[] = [
      "category",
      "gender",
      "color",
      "size",
      "material",
      "brand",
      "minPrice",
      "maxPrice",
    ];

    filterKeys.forEach((key) => params.delete(key));

    // ADDED: Reset pagination when filters change
    params.delete("page");

    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(","));
        }
      }

      // CHANGED: Skip default price values
      else if (
        value !== "" &&
        !(key === "minPrice" && value === 0) &&
        !(key === "maxPrice" && value === 100)
      ) {
        params.set(key, String(value));
      }
    });

    // CHANGED: replace prevents excessive browser history entries
    setSearchParams(params, { replace: true });
  };

  return (
    <>
      {/* Background overlay */}
      <div
        aria-hidden="true"
        onClick={closeFilter}
        className={`fixed inset-0 z-60 bg-black/50 backdrop-blur-sm
          transition-opacity duration-300 ease-out md:hidden
          ${
            mobileFilterOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
      />

      {/* Filter Sidebar */}
      <aside
        id="filter-sidebar"
        aria-label="Product filters"
        className={`fixed inset-y-0 left-0 z-61 flex h-dvh w-80 max-w-[85%] flex-col overflow-y-auto bg-[#161515] p-6 text-white shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none md:static md:z-auto md:h-auto md:w-64 md:shrink-0 md:translate-x-0 md:overflow-visible md:bg-transparent md:p-0 md:text-white md:shadow-none ${
          mobileFilterOpen
            ? "translate-x-0"
            : "-translate-x-full pointer-events-none md:pointer-events-auto"
        }`}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold">Filters</h2>

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
            <div key={item} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="category"
                value={item}
                checked={filters.category === item}
                onChange={handleFilterChange}
                className="cursor-pointer"
              />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Gender */}
        <div className="mb-6">
          <h3 className="mb-4 border-b border-gray-200 pb-2 text-xs font-bold uppercase tracking-wider md:border-neutral-800">
            Gender
          </h3>

          {genders.map((item) => (
            <div key={item} className="flex gap-2">
              <input
                type="checkbox"
                name="gender"
                value={item}
                checked={filters.gender === item}
                onChange={handleFilterChange}
                className="cursor-pointer"
              />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Size */}
        <div className="mb-6">
          <h3 className="mb-4 border-b border-gray-200 pb-2 text-xs font-bold uppercase tracking-wider md:border-neutral-800">
            Size
          </h3>

          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                name="size"
                value={size}
                onClick={handleFilterChange}
                aria-pressed={filters.size.includes(size)}
                className={`h-8 w-8 cursor-pointer rounded border text-xs font-bold transition-colors ${
                  filters.size.includes(size)
                    ? "border-orange-400 bg-orange-400 text-black"
                    : "border-gray-300/20"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div className="mb-6">
          <h3 className="mb-4 border-b border-gray-200 pb-2 text-xs font-bold uppercase tracking-wider md:border-neutral-800">
            Color
          </h3>

          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                name="color"
                value={color}
                onClick={handleFilterChange}
                aria-label={color}
                aria-pressed={filters.color === color}
                className={`h-8 w-8 cursor-pointer rounded-full transition-transform ${
                  filters.color === color
                    ? "ring-2 ring-orange-400 ring-offset-2 ring-offset-[#161515]"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
              />
            ))}
          </div>
        </div>

        {/* Brand */}
        <div className="mb-6">
          <h3 className="mb-4 border-b border-gray-200 pb-2 text-xs font-bold uppercase tracking-wider md:border-neutral-800">
            Brand
          </h3>

          {brands.map((item) => (
            <div key={item} className="flex gap-2">
              <input
                type="checkbox"
                name="brand"
                value={item}
                checked={filters.brand.includes(item)}
                onChange={handleFilterChange}
                className="cursor-pointer"
              />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Material */}
        <div className="mb-6">
          <h3 className="mb-4 border-b border-gray-200 pb-2 text-xs font-bold uppercase tracking-wider md:border-neutral-800">
            Material
          </h3>

          {materials.map((item) => (
            <div key={item} className="flex gap-2">
              <input
                type="checkbox"
                name="material"
                value={item}
                checked={filters.material.includes(item)}
                onChange={handleFilterChange}
                className="cursor-pointer"
              />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="mb-4 border-b pb-2 text-xs font-bold uppercase">
            Price Range
          </h3>

          <input
            type="range"
            name="maxPrice"
            min={0}
            max={100}
            step={1}
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="w-full accent-orange-400"
          />

          <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
            <span>$0</span>
            <span>${filters.maxPrice}</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
