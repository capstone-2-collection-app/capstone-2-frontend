import SearchBar from "../components/SearchBar";

function SearchPage() {
  return (
    <main className="page-container">
      <header className="page-header">
        <p className="eyebrow">Find something new</p>
        <h1>Search Music and Movies</h1>
        <SearchBar category="Music"></SearchBar>
        <p>Music and movie search tools will be added here.</p>
      </header>
    </main>
  );
}

export default SearchPage;
