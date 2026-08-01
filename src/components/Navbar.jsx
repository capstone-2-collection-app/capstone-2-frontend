import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

function Navbar() {
  const { logout } = useLogout();
  const { user } = useContext(AuthContext);

  return (
    <nav className="navbar" aria-label="Main navigation">
      <Link className="navbar__brand" to="/">
        Collection App
      </Link>
      <div className="navbar__links">
        {!user && (
          <div className="auth-links">
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign up</Link>
          </div>
        )}
        {user && (
          <div className="navbar__links">
            <span>{user.email}</span>
            <Link className="logout-button" to="/login" onClick={logout}>
              Logout
            </Link>
            <Link to="/">Home</Link>
            <Link to="/collections">My Collections</Link>
            <Link to="/search">Search Items</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
