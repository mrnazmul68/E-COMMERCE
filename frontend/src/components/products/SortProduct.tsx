import { type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";

const SortProduct = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const sortBy = e.target.value;

    const params = new URLSearchParams(searchParams);

    // Default sorting হলে URL থেকে sortBy remove হবে
    if (sortBy === "default") {
      params.delete("sortBy");
    } else {
      params.set("sortBy", sortBy);
    }

    setSearchParams(params);
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <select
        className="border bg-black px-2 py-1 text-sm"
        onChange={handleSortChange}
        value={searchParams.get("sortBy") || "default"}
      >
        <option value="default">Default</option>
        <option value="low-high">Price: Low → High</option>
        <option value="high-low">Price: High → Low</option>
        <option value="newest">Newest</option>
        <option value="popular">Popular</option>
      </select>
    </div>
  );
};

export default SortProduct;
