import { useState, useEffect } from "react";
import { useCollections } from "../context/CollectionsContext";
import CollectionCard from "../components/CollectionCard";
import CreateCard from "../components/CreateCard";
import SearchBar from "../components/SearchBar";
import { useAuthFetch } from "../hooks/useAuthFetch"; // imported authFetch hook

function CollectionsPage() {
  const { collections, loading, fetchCollections } = useCollections();
  const { selectedId, notifyMediaUpdated } = useCollections();
  const [isVisible, setIsVisible] = useState(false);

  const [category, setCategory] = useState("search");
  const [selectedItem, setSelectedItem] = useState(null);
  const [collectionMessage, setCollectionMessage] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const showSearchBar = category !== "search";

  // to use authFetch
  const authFetch = useAuthFetch(); // we want to add bearer token in our requ from the frontend

  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetchCollections();
  }, []);

  async function handleCreate({ SelectedId, name, category }) {
    try {
      setCollectionMessage("Creating collection...");
      let response;

      if (!SelectedId) {
        response = await authFetch(`${API_URL}/api/collections`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name,
            category: category,
          }),
        });
      } else {
        response = await authFetch(
          `${API_URL}/api/collections/${SelectedId}/children`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: name,
              category: category,
            }),
          },
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not create collection");
      }

      await fetchCollections();
      setCollectionMessage(`${data.name} was created.`);
      setIsVisible(false);
    } catch (err) {
      console.error("Failed to create collection:", err);
      setCollectionMessage(err.message);
    }
  }

  function popUp() {
    setCollectionMessage("");
    setIsVisible(!isVisible);
  }

  // async function handleAddChild(parentId, item) {
  //   try {
  //     await authFetch(
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
      await authFetch(`${API_URL}/api/collections/${id}`, {
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
        await authFetch(
          `${API_URL}/api/collections/${parentId}/tracks`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          },
        );
        notifyMediaUpdated(parentId);
        setSelectedItem(null);
        fetchCollections();
      } else {
        // No item -> Add button was clicked directly -> popUp the createCard component to add container
        popUp();
      }
    } catch (err) {
      console.error("Failed to add:", err);
    }
  }

  async function onSelect(item) {
    setSelectedItem(item);
  }

  async function handleShare() {
    try {
      setShareMessage("Creating share link...");

      const response = await authFetch(
        `${API_URL}/api/collections/${selectedId}/share`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.share_token) {
        throw new Error(data.error || "Could not create share link");
      }

      const shareUrl = `${window.location.origin}/shared/${data.share_token}`;
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage("Share link copied.");
    } catch (err) {
      console.error("Failed to share collection:", err);
      setShareMessage("Could not create share link.");
    }
  }

  if (loading) return <p>Loading...</p>;
  return (
    <main className="page-container">
      <header className="page-header">
        <span className="container">
          <h1>My Collections.</h1>
          {isVisible ? (
            <CreateCard
              SelectedId={selectedId}
              onSubmit={handleCreate}
              onCancel={popUp}
            ></CreateCard>
          ) : (
            <button className="create-btn" onClick={popUp}>
              Create
            </button>
          )}
          {isVisible?(<span></span>):(<>
          <h1>.</h1>
          <button
            className="share-btn"
            disabled={!selectedId}
            onClick={handleShare}
          >
            Share
          </button>
          {shareMessage && <p>{shareMessage}</p>}
          </>)}
        </span>
        {collectionMessage && <p>{collectionMessage}</p>}
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
        {showSearchBar && <SearchBar category={category} onSelect={onSelect} />}
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
                onAdd={onAdd}
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
