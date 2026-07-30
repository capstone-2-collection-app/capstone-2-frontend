import CollectionCard from "../components/CollectionCard";
import mockCollections from "../data/mockCollections";

function CollectionsPage() {
  return (
    <main className="page-container">
      <header className="page-header">
        <p className="eyebrow">Your saved items</p>
        <h1>My Collections</h1>
      </header>

      {mockCollections.length === 0 ? (
        <section className="empty-state">
          <h2>No collections yet</h2>
          <p>music and movie collections will appear here.</p>
        </section>
      ) : (
        <section className="collection-grid" aria-label="Your collections">
          {mockCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </section>
      )}
    </main>
  );
}

export default CollectionsPage;
