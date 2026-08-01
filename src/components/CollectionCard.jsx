import { useCollections } from "../context/CollectionsContext";
import { useState, useEffect } from "react";

function CollectionCard({ collection, depth = 0 }) {
  const { selectedId, setSelectedId, updatedCollection } = useCollections();
  const isSelected = selectedId === collection.collection_id;
  const [media, setMedia] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (collection.category !== "music" && collection.category !== "movie") {
        return;
      }
      setLoadingMedia(true);
      try {
        const endpoint = collection.category === "music" ? "tracks" : "movies";
        const res = await fetch(
          `http://localhost:3000/api/collections/${collection.collection_id}/${endpoint}`,
          { method: "GET", credentials: "include" },
        );
        const data = await res.json();
        if (!cancelled) setMedia(data);
      } catch (err) {
        console.error("Failed to fetch media:", err);
      } finally {
        if (!cancelled) setLoadingMedia(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [collection.collection_id, collection.category]);

  // targeted refetch only when THIS collection was the one updated
  useEffect(() => {
    if (updatedCollection?.id !== collection.collection_id) return;

    let cancelled = false;

    async function load() {
      if (collection.category !== "music" && collection.category !== "movie") {
        return;
      }
      setLoadingMedia(true);
      try {
        const endpoint = collection.category === "music" ? "tracks" : "movies";
        const res = await fetch(
          `http://localhost:3000/api/collections/${collection.collection_id}/${endpoint}`,
          { method: "GET", credentials: "include" },
        );
        const data = await res.json();
        if (!cancelled) setMedia(data);
      } catch (err) {
        console.error("Failed to fetch media:", err);
      } finally {
        if (!cancelled) setLoadingMedia(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [updatedCollection]);

  return (
    <div
      className={`collection-card depth-${depth} ${isSelected ? "selected" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedId(isSelected ? null : collection.collection_id);
      }}
    >
      <h2 className="card-header">{collection.name}</h2>
      {loadingMedia && <p className="media-loading">Loading...</p>}

      {media.length > 0 && (
        <ul className="collection-media">
          {media.map((m) => (
            <li key={m.id ?? m.track_id ?? m.movie_id} className="media-item">
              {collection.category === "music" ? (
                <>
                  <span className="track-name">{m.name}</span>
                  <span> by </span>
                  <span className="track-artist">{m.artist}</span>
                </>
              ) : (
                <span className="movie-title">{m.title}</span>
              )}
            </li>
          ))}
        </ul>
      )}
      {depth <= 2 && collection.children && collection.children.length > 0 && (
        <div className="collection-children">
          {collection.children.map((child) => (
            <CollectionCard
              key={child.collection_id}
              collection={child}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CollectionCard;
