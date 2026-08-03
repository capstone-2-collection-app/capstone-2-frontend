import { useState, useEffect } from "react";
import { useCollections } from "../context/CollectionsContext";
import CollectionCard from "../components/CollectionCard";
import CreateCard from "../components/CreateCard";
import { useAuthFetch } from "../hooks/useAuthFetch"; // imported authFetch hook

function CollectionsPage() {
  const { collections, loading, fetchCollections, selectedId, setSelectedId } =
    useCollections();
  const [isVisible, setIsVisible] = useState(false);
  const [parentCollectionId, setParentCollectionId] = useState(null);
  const [collectionMessage, setCollectionMessage] = useState("");
  const [shareMessage, setShareMessage] = useState("");

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
      setParentCollectionId(null);
    } catch (err) {
      console.error("Failed to create collection:", err);
      setCollectionMessage(err.message);
    }
  }

  function openCreateForm(parentId) {
    setCollectionMessage("");
    setParentCollectionId(parentId);
    setIsVisible(true);
  }

  function closeCreateForm() {
    setCollectionMessage("");
    setParentCollectionId(null);
    setIsVisible(false);
  }

  async function handleDelete(id) {
    const shouldDelete = window.confirm("Delete this collection?");

    if (!shouldDelete) {
      return;
    }

    try {
      setCollectionMessage("Deleting collection...");

      const response = await authFetch(`${API_URL}/api/collections/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Could not delete collection");
      }

      await fetchCollections();
      setSelectedId(null);
      setParentCollectionId(null);
      setShareMessage("");
      setCollectionMessage("Collection deleted.");
    } catch (err) {
      console.error("Failed to delete:", err);
      setCollectionMessage(err.message);
    }
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
              SelectedId={parentCollectionId}
              onSubmit={handleCreate}
              onCancel={closeCreateForm}
            ></CreateCard>
          ) : (
            <button
              className="create-btn"
              onClick={() => openCreateForm(null)}
            >
              Create Collection
            </button>
          )}
          {isVisible ? (
            <span></span>
          ) : (
            <>
              <h1>.</h1>
              <button
                className="share-btn"
                disabled={!selectedId}
                onClick={handleShare}
              >
                Share
              </button>
              {shareMessage && <p>{shareMessage}</p>}
            </>
          )}
        </span>
        {collectionMessage && <p>{collectionMessage}</p>}
      </header>
      <div className="toolbar">
        <button
          className="card-btn"
          disabled={!selectedId}
          onClick={() => openCreateForm(selectedId)}
        >
          Add Sub-collection
        </button>
        <button
          className="card-btn"
          disabled={!selectedId}
          onClick={() => handleDelete(selectedId)}
        >
          Delete
        </button>
      </div>
      <section className="empty-state">
        {collections.length === 0 ? (
          <span>
            <h2>No collections yet</h2>
            <p>Your music collections will appear here.</p>
          </span>
        ) : (
          <>
            {collections.map((c) => (
              <CollectionCard
                key={c.collection_id}
                collection={c}
              />
            ))}
          </>
        )}
      </section>
    </main>
  );
}

export default CollectionsPage;
