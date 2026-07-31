function CollectionCard({ collection, onAddChild, onDelete, depth = 0 }) {
  return (
    <div className="collection-card">
      <h2>{collection.name}</h2>

      {depth < 2 && (
        <>
          <button onClick={() => onAddChild(collection.collection_id)}>
            sub-list
          </button>
          <button onClick={() => onDelete(collection.collection_id)}>
            del
          </button>
        </>
      )
        
      }

      {depth <= 2 && collection.children && collection.children.length > 0 && (
        <div className="collection-children">
          {collection.children.map((child) => (
            <CollectionCard
              key={child.collection_id}
              collection={child}
              onAddChild={onAddChild}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CollectionCard;
