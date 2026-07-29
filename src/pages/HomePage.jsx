import { Link } from "react-router-dom";

function HomePage() {
  return (
    <main className="page-container">
      <section className="hero">
        <p className="eyebrow">Your music, your way</p>
        <h1>Build playlists for the songs you love.</h1>
        <p>
          Search for music, create personal playlists, and keep your favorite
          songs organized in one place.
        </p>

        <div className="hero__actions">
          <Link className="button" to="/playlists">
            View Playlists
          </Link>
          <Link className="button button--secondary" to="/search">
            Search Songs
          </Link>
        </div>
      </section>
    </main>
  );
}

export default HomePage;

