import { Link } from "react-router-dom";

function HomePage() {
  return (
    <main className="page-container">
      <section className="hero">
        <p className="eyebrow">Your favorites, your way</p>
        <h1>Keep everything you enjoy in one place.</h1>
        <p>
          Create collections for music and movies, then save your favorite
          items so they are easy to find and share.
        </p>

        <div className="hero__actions">
          <Link className="button" to="/collections">
            View Collections
          </Link>
          <Link className="button button--secondary" to="/search">
            Search Items
          </Link>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
