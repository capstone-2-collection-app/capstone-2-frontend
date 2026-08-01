import { useState } from "react";
import { CollectionsContext } from "./CollectionsContext";
import { useAuthFetch } from "../hooks/useAuthFetch";

export function CollectionsProvider({ children }) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // in CollectionsContext.jsx
  const [updatedCollection, setUpdatedCollection] = useState(null); // { id, version }

  // authenticated fetch
  const authFetch = useAuthFetch();

  function notifyMediaUpdated(collectionId) {
    setUpdatedCollection({ id: collectionId, version: Date.now() });
  }

  // include in context value:
  // { collections, loading, fetchCollections, selectedId, setSelectedId, updatedCollection, notifyMediaUpdated }

  const fetchCollections = async () => {
    const initial_load = collections.length === 0 && loading;
    initial_load ? setLoading(true) : setIsReload(true);
    try {
      // added bearer token
      const res = await authFetch("http://localhost:3000/api/collections", {
        credentials: "include", // required so the guest_id cookie is sent
      });
      const data = await res.json();
      setCollections(data);
    } catch (err) {
      console.error("Failed to fetch collections:", err);
    } finally {
      setLoading(false);
      setIsReload(false);
    }
  };

  //   useEffect(() => {
  //     fetchCollections();
  //   }, []);

  return (
    <CollectionsContext.Provider
      value={{
        collections,
        setCollections,
        loading,
        isReload,
        fetchCollections,
        selectedId,
        setSelectedId,
        updatedCollection,
        notifyMediaUpdated,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
}
