import { FaList, FaTableCells } from "react-icons/fa6";

const SortProduct = () => {
    return (
        <>
             <div className="flex justify-center items-center gap-4">
            <select className="text-sm border px-2 py-1">
              <option value="popular">All</option>
              <option value="newest">Newest</option>
              <option value="low-high">Price: Low → High</option>
              <option value="high-low">Price: High → Low</option>
              <option value="popular">Popular</option>
            </select>

            <FaTableCells />
            <FaList />
          </div>
        </>
    );
};

export default SortProduct;