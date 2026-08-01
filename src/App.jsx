import { Route, Routes, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import CollectionsPage from "./pages/CollectionsPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import { CollectionsProvider } from "./context/CollectionsProvider.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import { useContext } from "react";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <CollectionsProvider>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/login"></Navigate>}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/"></Navigate>}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/"></Navigate>}
        />
        <Route
          path="/collections"
          element={user ? <CollectionsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/search"
          element={user ? <SearchPage /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={user ? <HomePage /> : <Navigate to="/login"></Navigate>}
        />
      </Routes>
    </CollectionsProvider>
  );
}

export default App;
