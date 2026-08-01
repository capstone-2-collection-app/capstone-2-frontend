import { useCollections } from "../context/CollectionsContext";
import { useState, useEffect } from "react";
import ListItem from "./ListItem";

function CollectionCard({ collection, depth = 0 }) {
  const { selectedId, setSelectedId, updatedCollection } = useCollections();
  const isSelected = selectedId === collection.collection_id;
  const [media, setMedia] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState(new Set());

  function getItemId(item) {
    return item.id ?? item.track_id ?? item.movie_id;
  }

  function toggleEdit(e) {
    e.stopPropagation();
    setIsEditing((prev) => !prev);
    setSelectedItemIds(new Set()); // reset selection whenever edit mode toggles
  }

  function toggleItemSelected(item) {
    const id = getItemId(item);
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleDeleteSelected(e) {
    e.stopPropagation();

    let endpoint;
    switch (collection.category) {
      case "music":
        endpoint = "tracks";
        break;
      case "movie":
        endpoint = "movies";
        break;

      default:
        console.warn(`No delete handler for category: ${collection.category}`);
        return;
    }

    try {
      await Promise.all(
        [...selectedItemIds].map((id) =>
          fetch(
            `http://localhost:3000/api/collections/${collection.collection_id}/${endpoint}/${id}`,
            { method: "DELETE", credentials: "include" },
          ),
        ),
      );
      setMedia((prev) =>
        prev.filter((m) => !selectedItemIds.has(getItemId(m))),
      );
      setSelectedItemIds(new Set());
    } catch (err) {
      console.error("Failed to delete selected items:", err);
    }
  }

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
      {/* Card header with edit button*/}
      <div className="card-toolbar">
        <h2 className="card-header">{collection.name}</h2>
        <span>
          {isEditing && (
            <button
              className="dlt-btn"
              disabled={selectedItemIds.size === 0}
              onClick={handleDeleteSelected}
            >
              Delete ({selectedItemIds.size})
            </button>
          )}
          <button className="edit-btn" onClick={toggleEdit}>
            {isEditing ? "Done" : "Edit"}
          </button>
        </span>
      </div>

      {loadingMedia && collection.category !== "container" && (
        <p className="media-loading">Loading...</p>
      )}

      {/*
       This iterates over the fetched media(movies/music/books/etc..)
       and creates a list based on the category of the container.
       */}
      {media.length > 0 && collection.category === "music" && (
        <ul className="collection-media">
          {media.map((li) => (
            <ListItem
              key={li.id}
              item={li}
              className="media-item"
              containerType={collection.category}
              isEditing={isEditing}
              isChecked={selectedItemIds.has(getItemId(li))}
              onToggleSelect={toggleItemSelected}
            ></ListItem>
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
