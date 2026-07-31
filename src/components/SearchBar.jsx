import { useState } from "react";

function SearchBar({ category, onSearch, placeholder }) {
  const [query, setQuery] = useState("");

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  }

  return (
    <div className="form-field">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder ?? `Search ${category ?? ""}...`}
      />
    </div>
  );
}

export default SearchBar;