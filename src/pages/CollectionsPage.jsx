import { useState, useEffect } from "react";
import { useCollections } from "../context/CollectionsContext";
import CollectionCard from "../components/CollectionCard";
import CreateCard from "../components/CreateCard";
import SearchBar from "../components/SearchBar";

function CollectionsPage() {
  const { collections, loading, fetchCollections } = useCollections();
   const { selectedId, notifyMediaUpdated} = useCollections();
  const [isVisible, setIsVisible] = useState(false);


  const [category, setCategory] = useState("search");
  const [selectedItem, setSelectedItem] = useState(null); 
  const showSearchBar = category !== "search";

  useEffect(() => {
    fetchCollections();
  }, []);

  async function handleCreate({ name, category }) {
    try {
      await fetch("http://localhost:3000/api/collections", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          category: category,
        }),
      });
      fetchCollections();
    } catch (err) {
      console.error("Failed to create collection:", err);
    } finally {
      setIsVisible(false);
    }
  }

  function popUp() {
    setIsVisible(!isVisible);
  }

  // async function handleAddChild(parentId, item) {
  //   try {
  //     await fetch(
  //       `http://localhost:3000/api/collections/${parentId}/children`,
  //       {
  //         method: "POST",
  //         credentials: "include",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           name: "New Sub-Collection",
  //           category: "mixed",
  //         }),
  //       },
  //     );
  //     fetchCollections();
  //   } catch (err) {
  //     console.error("Failed to create child collection:", err);
  //   }
  // }

  async function handleDelete(id) {
    try {
      await fetch(`http://localhost:3000/api/collections/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchCollections();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  }

async function onAdd(parentId, item) {
  try {
    if (item) {
      // A search result was selected -> add as a track
      await fetch(
        `http://localhost:3000/api/collections/${parentId}/tracks`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        },
      );
      notifyMediaUpdated(parentId)
    } else {
      // No item -> Add button was clicked directly -> create a child collection
      await fetch(
        `http://localhost:3000/api/collections/${parentId}/children`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "New Sub-Collection",
            category: "mixed",
          }),
        },
      );
    }
    fetchCollections();
  } catch (err) {
    console.error("Failed to add:", err);
  }
}

async function onSelect(item) {
  setSelectedItem(item)
}
  if (loading) return <p>Loading...</p>;
  return (
    <main className="page-container">
      <header className="page-header">
        <span className="container">
          <h1>My Collections.</h1>
          {isVisible ? (
            <CreateCard onSubmit={handleCreate} onCancel={popUp}></CreateCard>
          ) : (
            <button className="create-btn" onClick={popUp}>
              Create
            </button>
          )}
        </span>
      </header>
      <div className="toolbar">
        <button
          className="card-btn"
          disabled={!selectedId}
          onClick={() => onAdd(selectedId, selectedItem)}
        >
          Add
        </button>
        <button
          className="card-btn"
          disabled={!selectedId}
          onClick={() => handleDelete(selectedId)}
        >
          Delete
        </button>
        <select
          className="selection"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={!selectedId}
        >
          <option value="search">Add something!!</option>
          <option value="Music">Music</option>
          <option value="Movies">Movies</option>
          <option value="Books">Books</option>
        </select>
        {showSearchBar && <SearchBar category={category} onSelect={onSelect}/>}
      </div>
      <section className="empty-state">
        {collections.length === 0 ? (
          <span>
            <h2>No collections yet</h2>
            <p>Your music and movie collections will appear here.</p>
          </span>
        ) : (
          <>
            {console.log(collections)}
            {collections.map((c) => (
              <CollectionCard
                key={c.collection_id}
                collection={c}
                onAddChild={onAdd}
                onDelete={handleDelete}
              />
            ))}
          </>
        )}
      </section>
    </main>
  );
}

export default CollectionsPage;
