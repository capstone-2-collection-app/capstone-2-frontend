function ListItem({ item, className, containerType, isEditing, isChecked, onToggleSelect }) {
  let content;

  switch (containerType) {
    case "music":
      content = (
        <>
          <span className="track-name">{item.name}</span>
          <span> by </span>
          <span className="track-artist">{item.artist}</span>
        </>
      );
      break;

    case "movie":
      content = <span className="movie-title">{item.title}</span>;
      break;

    default:
      content = null;
      break;
  }

  return (
    <li
      className={`${className} ${isChecked ? "checked" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        if (isEditing) onToggleSelect(item);
      }}
    >
      {isEditing && (
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => {
            e.stopPropagation();
            onToggleSelect(item);
          }}
        />
      )}
      {content}
    </li>
  );
}

export default ListItem;