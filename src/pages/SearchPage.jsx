import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import { useCollections } from "../context/CollectionsContext";
import { useAuthFetch } from "../hooks/useAuthFetch";

function getMusicCollections(collections) {
  const musicCollections = [];

  collections.forEach((collection) => {
    if (collection.category?.toLowerCase() === "music") {
      musicCollections.push(collection);
    }

    collection.children?.forEach((child) => {
      if (child.category?.toLowerCase() === "music") {
        musicCollections.push(child);
      }

      child.children?.forEach((grandchild) => {
        if (grandchild.category?.toLowerCase() === "music") {
          musicCollections.push(grandchild);
        }
      });
    });
  });

  return musicCollections;
}

function SearchPage() {
  const { collections, loading, fetchCollections, notifyMediaUpdated } =
    useCollections();
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [message, setMessage] = useState("");
  const authFetch = useAuthFetch();
  const API_URL = import.meta.env.VITE_API_URL;
  const musicCollections = getMusicCollections(collections);

  useEffect(() => {
    if (collections.length === 0 && loading) {
      fetchCollections();
    }
  }, [collections.length, loading, fetchCollections]);

  async function handleAddTrack() {
    if (!selectedCollectionId || !selectedTrack) {
      return;
    }

    try {
      setMessage("Adding song...");

      const response = await authFetch(
        `${API_URL}/api/collections/${selectedCollectionId}/tracks`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedTrack),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not add song");
      }

      notifyMediaUpdated(Number(selectedCollectionId));
      setSelectedTrack(null);
      setMessage(`${data.name} was added to your collection.`);
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <main className="page-container">
      <header className="page-header">
        <p className="eyebrow">Find something new</p>
        <h1>Search Music</h1>
        <p>Search for a song and add it to one of your music collections.</p>
      </header>

      <label htmlFor="music-collection">Choose a music collection</label>
      <select
        id="music-collection"
        className="selection"
        value={selectedCollectionId}
        onChange={(e) => {
          setSelectedCollectionId(e.target.value);
          setMessage("");
        }}
      >
        <option value="">Select a collection</option>
        {musicCollections.map((collection) => (
          <option
            key={collection.collection_id}
            value={collection.collection_id}
          >
            {collection.name}
          </option>
        ))}
      </select>

      {musicCollections.length === 0 ? (
        <p>Create a music collection before adding a song.</p>
      ) : (
        <>
          <SearchBar
            category="Music"
            onResults={() => {
              setSelectedTrack(null);
              setMessage("");
            }}
            onSelect={setSelectedTrack}
          />
          <button
            className="button"
            type="button"
            disabled={!selectedCollectionId || !selectedTrack}
            onClick={handleAddTrack}
          >
            Add to Collection
          </button>
        </>
      )}

      {message && <p>{message}</p>}
    </main>
  );
}

export default SearchPage;
