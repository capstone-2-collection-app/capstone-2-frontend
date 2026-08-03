import { useState, useEffect, useRef } from "react";
import { useAuthFetch } from "../hooks/useAuthFetch";

function SearchBar({
  category,
  onResults,
  onSelect,
  placeholder,
  delay = 500,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const timeoutRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // authFetch - only user with auth token can search
  const authFetch = useAuthFetch();

  async function fetchMusic(searchTerm) {
    const res = await authFetch(
      `${API_URL}/search/track?search=${encodeURIComponent(searchTerm)}`,
      { method: "GET", credentials: "include" },
    );
    return res.json();
  }

  async function handleSearch(searchTerm) {
    if (!searchTerm) {
      setResults([]);
      setSelectedIndex(null);
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
      setSelectedIndex(null);
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

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      clearTimeout(timeoutRef.current);
      handleSearch(query);
    }
  }

  function handleSelect(index, track) {
    const newSelectedIndex = selectedIndex === index ? null : index;
    setSelectedIndex(newSelectedIndex);
    console.log(track);
    onSelect?.(newSelectedIndex === null ? null : track);
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
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? `Search ${category ?? ""}...`}
      />
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((track, i) => (
            <li
              key={i}
              className={`search-result-item ${selectedIndex === i ? "selected" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(i, track);
              }}
            >
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
