# Capstone 2 Collection Frontend

Frontend for a collection application where users can organize and share their
favorite music and movies.

## Current frontend foundation

- React and Vite
- React Router
- Home, collections, and search routes
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
