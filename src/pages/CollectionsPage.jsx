import { useState, useEffect } from "react";
import { useCollections } from "../context/CollectionsContext";
import CollectionCard from "../components/CollectionCard";
import CreateCard from "../components/CreateCard";

function CollectionsPage() {
  const { collections, loading, fetchCollections } = useCollections();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  async function handleCreate({name, category}) {
    try {
      await fetch("http://localhost:3000/api/collections", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          category: category ,
        }),
      });
      fetchCollections();
    } catch (err) {
      console.error("Failed to create collection:", err);
    }finally{
      setIsVisible(false)
    }
  }


  function popUp(){
    setIsVisible(!isVisible)
  }

  async function handleAddChild(parentId) {
    try {
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
      fetchCollections();
    } catch (err) {
      console.error("Failed to create child collection:", err);
    }
  }

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

  if (loading) return <p>Loading...</p>;
  return (
    <main className="page-container">
      <header className="page-header">
        <p className="eyebrow">Your saved items</p>
        <span>
          <h1>My Collections</h1>
          {isVisible? <CreateCard onSubmit={handleCreate} onCancel={popUp}></CreateCard>:<button className="create-btn" onClick={popUp}>Create</button> }
          
        </span>
        
      </header>

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
                onAddChild={handleAddChild}
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
