import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <Link className="navbar__brand" to="/">
        Collection App
      </Link>

      <div className="navbar__links">
        <Link to="/">Home</Link>
        <Link to="/collections">My Collections</Link>
        <Link to="/search">Search Items</Link>
      </div>
    </nav>
  );
}

export default Navbar;
