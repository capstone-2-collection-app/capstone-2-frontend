import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <Link className="navbar__brand" to="/">
        Playlist App
      </Link>

      <div className="navbar__links">
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign up</Link>
        <Link to="/">Home</Link>
        <Link to="/playlists">My Playlists</Link>
        <Link to="/search">Search Songs</Link>
      </div>
    </nav>
  );
}

export default Navbar;
