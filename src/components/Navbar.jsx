import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";

function Navbar() {
  const { logout } = useLogout();

  return (
    <nav className="navbar" aria-label="Main navigation">
      <Link className="navbar__brand" to="/">
        Playlist App
      </Link>

      <div className="navbar__links">
        <div>
          <Link className="logout-button" to="/login" onClick={logout}>
            Logout
          </Link>
        </div>
        <div className="auth-links">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign up</Link>
        </div>

        <Link to="/">Home</Link>
        <Link to="/playlists">My Playlists</Link>
        <Link to="/search">Search Songs</Link>
      </div>
    </nav>
  );
}

export default Navbar;
