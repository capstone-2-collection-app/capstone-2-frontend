import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useLogout = () => {
  const { dispatch } = useContext(AuthContext);

  const logout = () => {
    // remove user data from local storate
    localStorage.removeItem("user");

    // set global user back to null
    dispatch({ type: "LOGOUT" });
  };

  return { logout };
};
