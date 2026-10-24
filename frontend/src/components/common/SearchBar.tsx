import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode, RefObject } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { useLocation } from "react-router-dom";

type SearchBarContextValue = {
  searchOpen: boolean;
  query: string;
  searchRef: RefObject<HTMLInputElement | null>;
  setQuery: (query: string) => void;
  handleSearch: (event: FormEvent<HTMLFormElement>) => void;
  toggleSearch: () => void;
};

const SearchBarContext = createContext<SearchBarContextValue | null>(null);

const useSearchBar = () => {
  const context = useContext(SearchBarContext);
  if (!context) {
    throw new Error("SearchBar controls must be used within SearchBar.");
  }
  return context;
};

type SearchBarProps = {
  children: ReactNode;
};

//search bar
const SearchBar = ({ children }: SearchBarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  //close searchbar while chage route
  useEffect(() => {
    setSearchOpen(false);
  }, [location.pathname]);

  //close searchbar while keydown esc
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  //add focus when searchbar is opened
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  //handle search
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    console.log("Search:", query); // replace with navigate(`/shop?q=${query}`)
    setSearchOpen(false);
  };

  return (
    <SearchBarContext.Provider
      value={{
        searchOpen,
        query,
        searchRef,
        setQuery,
        handleSearch,
        toggleSearch: () => setSearchOpen((isOpen) => !isOpen),
      }}
    >
      {children}
    </SearchBarContext.Provider>
  );
};

//search bar toggle
export const SearchBarToggle = () => {
  const { searchOpen, toggleSearch } = useSearchBar();

  return (
    <button
      aria-label="Search"
      onClick={toggleSearch}
      className="relative p-2 rounded-full text-gray-300 hover:text-orange-500 hover:bg-white/10 active:scale-90 transition duration-200"
    >
      {searchOpen ? <X size={21} /> : <Search size={21} strokeWidth={1.8} />}
    </button>
  );
};

//searchbar panel
export const SearchBarPanel = () => {
  const { handleSearch, query, searchOpen, searchRef, setQuery } =
    useSearchBar();

  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-out ${
        searchOpen ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <form
        onSubmit={handleSearch}
        className="max-w-3xl mx-auto px-4 sm:px-6 pb-4"
      >
        <div className="flex items-center gap-3 rounded-full bg-white/10 border border-white/10 focus-within:border-orange-500 px-4 transition">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for products..."
            className="w-full bg-transparent py-3 text-sm text-white placeholder-gray-500 outline-none"
          />
          <button
            type="submit"
            aria-label="Submit search"
            className="p-1.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 active:scale-90 transition"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
