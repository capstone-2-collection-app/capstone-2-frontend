function CollectionCard({ collection }) {
  const categoryIcon = collection.category === "music" ? "🎵" : "🎬";

  return (
    <article className="collection-card">
      <div className="collection-card__top">
        <span className="collection-card__icon" aria-hidden="true">
          {categoryIcon}
        </span>
        <span className="collection-card__category">
          {collection.category}
        </span>
      </div>

      <h2>{collection.name}</h2>
      <p>{collection.description}</p>
      <span className="collection-card__count">
        {collection.itemCount} items
      </span>
    </article>
  );
}

export default CollectionCard;
