import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/results?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="flex w-full rounded-lg outline-dark-cream focus-within:outline md:w-[80%] lg:w-[45%]">
      <input
        type="search"
        placeholder="Search for a movie or actor. . ."
        className="flex-1 rounded-l-lg border-none p-3 text-charcoal outline-none"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        className="rounded-r-lg bg-dark-cream p-3 hover:bg-light-cream"
        onClick={handleSearch}
      >
        <Icon path={mdiMagnify} size={1} className="text-charcoal" />
      </button>
    </div>
  );
}

export default SearchBar;
