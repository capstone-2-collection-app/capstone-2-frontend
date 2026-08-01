// resusable authenticated-fetch hook
// replace normal fetch with this -  whatever you think your page/action/response should be authenticated

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuthFetch() {
  const { user } = useContext(AuthContext);

  async function authFetch(url, options = {}) {
    if (!user || !user.token) {
      throw new Error("You must log in first.");
    }

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  return authFetch;
}
