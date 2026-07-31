import { useState } from "react";
import { CollectionsContext } from "./CollectionsContext";

export function CollectionsProvider({ children }) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReload, setIsReload] = useState(false);

  const fetchCollections = async () => {
    const initial_load = collections.length === 0 && loading;
    initial_load ? setLoading(true) : setIsReload(true);
    try {
      const res = await fetch("http://localhost:3000/api/collections", {
        credentials: "include", // required so the guest_id cookie is sent
      });
      const data = await res.json();
      setCollections(data);
    } catch (err) {
      console.error("Failed to fetch collections:", err);
    } finally {
      setLoading(false);
      setIsReload(false)
    }
  };

  //   useEffect(() => {
  //     fetchCollections();
  //   }, []);

  return (
    <CollectionsContext.Provider
      value={{ collections, setCollections, loading, isReload,fetchCollections }}
    >
      {children}
    </CollectionsContext.Provider>
  );
}
