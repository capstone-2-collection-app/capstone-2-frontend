import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function SharedCollectionPage() {
  const { shareToken } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getSharedCollection() {
      try {
        const response = await fetch(`${API_URL}/api/shared/${shareToken}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Shared collection not found");
        }

        setCollection(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getSharedCollection();
  }, [shareToken]);

  if (loading) {
    return <p>Loading shared collection...</p>;
  }

  if (error) {
    return (
      <main className="page-container">
        <h1>Collection unavailable</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="page-container">
      <header className="page-header">
        <p className="eyebrow">Shared collection</p>
        <h1>{collection.name}</h1>
        <p>Category: {collection.category}</p>
      </header>
    </main>
  );
}

export default SharedCollectionPage;
