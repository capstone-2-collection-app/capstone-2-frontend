function PlaylistsPage() {
  return (
    <main className="page-container">
      <header className="page-header">
        <p className="eyebrow">Your collection</p>
        <h1>My Playlists</h1>
      </header>

      <section className="empty-state">
        <h2>No playlists yet</h2>
        <p>Your playlists will appear here after you create one.</p>
      </section>
    </main>
  );
}

export default PlaylistsPage;

