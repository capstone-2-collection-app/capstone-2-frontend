// custom hook for login/sign up

import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { useState } from "react";

export function useAuth() {
  const { dispatch } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  function loginAsGuest() {
  return authenticate("guest", {});
}

  // two endpoints/input data for login and sign up
  async function authenticate(endpoint, userInput) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/user/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInput),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return null;
      }

      // local storage
      localStorage.setItem("user", JSON.stringify(data));

      // update global user context
      dispatch({ type: "LOGIN", payload: data });

      return data;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  function signup(name, email, password) {
    return authenticate("signup", {
      name,
      email,
      password,
    });
  }

  function login(email, password) {
    return authenticate("login", {
      email,
      password,
    });
  }

  return {
    signup,
    login,
    loginAsGuest,
    isLoading,
    error,
  };
}
