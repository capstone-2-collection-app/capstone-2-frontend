import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import CollectionsPage from "./pages/CollectionsPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import { CollectionsProvider } from "./context/CollectionsProvider.jsx";

function App() {
  return (
    <CollectionsProvider>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </CollectionsProvider>
  );
}

export default App;
