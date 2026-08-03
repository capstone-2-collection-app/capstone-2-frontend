import { useState, useEffect, useRef } from "react";
import { useAuthFetch } from "../hooks/useAuthFetch";

function SearchBar({
  category,
  onAdd,
  canAdd,
  placeholder,
  delay = 500,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const timeoutRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // authFetch - only user with auth token can search
  const authFetch = useAuthFetch();

  async function fetchMusic(searchTerm) {
    const res = await authFetch(
      `${API_URL}/search/track?search=${encodeURIComponent(searchTerm)}`,
      { method: "GET", credentials: "include" },
    );
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || data.message || "Music search failed");
    }

    return data;
  }

  async function handleSearch(searchTerm) {
    if (!searchTerm) {
      setResults([]);
      setError("");
      return;
    }

    try {
      setError("");
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
    } catch (err) {
      console.error(`Search failed for category "${category}":`, err);
      setResults([]);
      setError(err.message);
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
      handleSearch(e.currentTarget.value);
    }
  }

  async function handleAdd(track) {
    const wasAdded = await onAdd?.(track);

    if (wasAdded) {
      setQuery("");
      setResults([]);
    }
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
            <li key={`${track.name}-${track.artist}-${i}`} className="search-result-item">
              <span className="track-name">{track.name}</span>
              <span> by </span>
              <span className="track-artist">{track.artist}</span>
              <button
                className="search-add-button"
                type="button"
                disabled={!canAdd}
                onClick={() => handleAdd(track)}
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <p>{error}</p>}
    </div>
  );
}

export default SearchBar;
