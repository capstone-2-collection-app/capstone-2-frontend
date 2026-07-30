# Capstone 2 Playlist Frontend

Frontend for a playlist application where users can organize their favorite
songs into personal playlists.

## Current frontend foundation

- React and Vite
- React Router
- Home, playlists, and song-search routes
- Shared navigation and starter responsive styling
- Environment variable for the backend URL

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

The default frontend address is `http://localhost:5173`.

## Environment variables

```text
VITE_API_URL=http://localhost:3000
```

Do not commit the real `.env` file.
