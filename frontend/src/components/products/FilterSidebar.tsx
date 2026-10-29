import type { Dispatch, SetStateAction } from "react";
import { FaXmark } from "react-icons/fa6";

type Props = {
  mobileFilterOpen: boolean;
  setMobileFilterOpen: Dispatch<SetStateAction<boolean>>;
};

const FilterSidebar = ({ mobileFilterOpen, setMobileFilterOpen }: Props) => {
  const closeFilter = () => setMobileFilterOpen(false);

  return (
    <>
      {/* Background overlay */}
      <div
        aria-hidden="true"
        onClick={closeFilter}
        className={`fixed inset-0 z-60 bg-black/50 backdrop-blur-sm
          transition-opacity duration-300 ease-out
          ${
            mobileFilterOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
      />

      {/* Left drawer */}
      <aside
        id="filter-sidebar"
        aria-label="Product filters"
        aria-hidden={!mobileFilterOpen}
        className={`fixed inset-y-0 left-0 z-61
          flex h-dvh w-80 max-w-[85%] flex-col
          overflow-y-auto bg-white p-6 text-black shadow-2xl
          transition-transform duration-300 ease-out
          motion-reduce:transition-none
          ${
            mobileFilterOpen
              ? "translate-x-0"
              : "-translate-x-full pointer-events-none"
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
            className="rounded-full p-2 transition-colors
              hover:bg-gray-100"
          >
            <FaXmark size={20} />
          </button>
        </div>

        {/* Category */}
        <div className="mb-6">
          <h3 className="mb-4 border-b pb-2 text-xs font-bold uppercase">
            Category
          </h3>
        </div>

        {/* Size */}
        <div className="mb-6">
          <h3 className="mb-4 border-b pb-2 text-xs font-bold uppercase">
            Size
          </h3>

          <div className="flex flex-wrap gap-2">
            {/* তোমার sizes.map(...) এখানে রাখবে */}
          </div>
        </div>

        {/* Color */}
        <div className="mb-6">
          <h3 className="mb-4 border-b pb-2 text-xs font-bold uppercase">
            Color
          </h3>

          <div className="flex flex-wrap gap-2">
            {/* তোমার colors.map(...) এখানে রাখবে */}
          </div>
        </div>

        {/* Price */}
        <div>
          <h3 className="mb-4 border-b pb-2 text-xs font-bold uppercase">
            Price
          </h3>

          <input
            type="range"
            min="0"
            max="50000"
            aria-label="Maximum product price"
            className="w-full accent-black"
          />
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
