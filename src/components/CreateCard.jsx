import { useState } from "react";

function CreateCard({ SelectedId, onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ SelectedId, name, category });
  };

  return (
    <div className="form-card">
      <h3 className="card-header">Create Collection</h3>
      <form onSubmit={handleSubmit}>
        <span className="field-container">
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>
                Choose a category
              </option>
              <option value="Container">Container (folders only)</option>
              <option value="Music">Music</option>
              <option value="Movies" disabled>
                Movies (coming soon)
              </option>
              <option value="Books" disabled>
                Books (coming soon)
              </option>
            </select>
          </div>
        </span>

        <div className="btn-container">
          <button type="submit" className="card-btn">
            Submit
          </button>
          <button
            type="button"
            className="card-btn card-btn--secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCard;
