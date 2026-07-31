import { useState, useEffect, useRef } from "react";

function SearchBar({ category, onResults, placeholder, delay = 500 }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const timeoutRef = useRef(null);

  async function fetchMusic(searchTerm) {
    const res = await fetch(
      `http://localhost:3000/search/track?search=${encodeURIComponent(searchTerm)}`,
      { method: "GET", credentials: "include" }
    );
    return res.json();
  }

  async function handleSearch(searchTerm) {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    try {
      let data;
      switch (category) {
        case "Music":
          data = await fetchMusic(searchTerm);
          break;
        default:
          console.warn(`No search handler for category: ${category}`);
          return;
      }
      const topFive = data.slice(0, 5);
      setResults(topFive);
      onResults?.(topFive);
    } catch (err) {
      console.error(`Search failed for category "${category}":`, err);
    }
  }

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, delay);
  }

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div className="form-field">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder ?? `Search ${category ?? ""}...`}
      />
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((track, i) => (
            <li key={i} className="search-result-item">
              <span className="track-name">{track.name}</span>
              <span> by </span>
              <span className="track-artist">{track.artist}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;