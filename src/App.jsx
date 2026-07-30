import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import PlaylistsPage from "./pages/PlaylistsPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/playlists" element={<PlaylistsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;

