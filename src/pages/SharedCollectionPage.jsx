import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function CollectionItems({ collection }) {
  return (
    <>
      <section>
        <h2>Music</h2>
        {collection.tracks.length === 0 ? (
          <p>No music in this collection.</p>
        ) : (
          collection.tracks.map((track) => (
            <article key={track.track_id}>
              <h3>{track.name}</h3>
              <p>{track.artist}</p>
            </article>
          ))
        )}
      </section>

      <section>
        <h2>Movies</h2>
        {collection.movies.length === 0 ? (
          <p>No movies in this collection.</p>
        ) : (
          collection.movies.map((movie) => (
            <article key={movie.movie_id}>
              <h3>{movie.title}</h3>
              <p>{movie.director}</p>
            </article>
          ))
        )}
      </section>

      {collection.children.length > 0 && (
        <section>
          <h2>Collections</h2>
          {collection.children.map((child) => (
            <article key={child.collection_id}>
              <h3>{child.name}</h3>
              <p>Category: {child.category}</p>
              <CollectionItems collection={child} />
            </article>
          ))}
        </section>
      )}
    </>
  );
}

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

      <CollectionItems collection={collection} />
    </main>
  );
}

export default SharedCollectionPage;
