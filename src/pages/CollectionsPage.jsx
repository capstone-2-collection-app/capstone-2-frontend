function CollectionsPage() {
  return (
    <main className="page-container">
      <header className="page-header">
        <p className="eyebrow">Your saved items</p>
        <h1>My Collections</h1>
      </header>

      <section className="empty-state">
        <h2>No collections yet</h2>
        <p>Your music and movie collections will appear here.</p>
      </section>
    </main>
  );
}

export default CollectionsPage;

