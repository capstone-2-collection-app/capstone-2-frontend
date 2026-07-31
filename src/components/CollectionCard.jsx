import { useCollections } from "../context/CollectionsContext";

function CollectionCard({ collection, depth = 0 }) {
  const { selectedId, setSelectedId } = useCollections();
  const isSelected = selectedId === collection.collection_id;
  return (
    <div
      className={`collection-card depth-${depth} ${isSelected ? "selected" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedId(isSelected? null : collection.collection_id)}}
    >
      <h2 className="card-header">{collection.name}</h2>
      {/* <span className="btn-container">
        <form>
          <div className="form-field">
            <select
              id="category"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            >
              <option value="search">Add something!!</option>
              <option value="Music">Music</option>
              <option value="Movies">Movies</option>
              <option value="Books">Books</option>
            </select>
          </div>
        </form>
        {depth < 2 && (
          <>
            <button
              className="card-btn"
              onClick={() => onAddChild(collection.collection_id)}
            >
              Add
            </button>
          </>
        )}
        <button
          className="card-btn"
          onClick={() => onDelete(collection.collection_id)}
        >
          delete
        </button>
      </span> */}
      {/* {showSearchBar ? <SearchBar></SearchBar> : <span></span>} */}
      {depth <= 2 && collection.children && collection.children.length > 0 && (
        <div className="collection-children">
          {collection.children.map((child) => (
            <CollectionCard
              key={child.collection_id}
              collection={child}
              // onAddChild={onAddChild}
              // onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CollectionCard;
