import { useNavigate } from "react-router-dom";
import "./Signup.css";
import { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

function Signup() {
  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [signupStatus, setSignupStatus] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // create user
  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    const response = await fetch(`${API_URL}/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(data.message);
    }

    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(data));

      // update authcontext
      dispatch({ type: "LOGIN", payload: data });
      setIsLoading(false);
      setEmail("");
      setName("");
      setPassword("");
      setSignupStatus("Account Registered.");
    }
  }

  return (
    <main className="signup-page">
      <section className="signup-card">
        <h1>Sign up</h1>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          <div className="signup-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="text"
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div className="signup-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          <button className="signup-submit" type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </button>

          {error && <div className="signup-message signup-error">{error}</div>}

          {signupStatus && (
            <div className="signup-message signup-success">{signupStatus}</div>
          )}
        </form>

        <div className="signup-divider">
          <span>or</span>
        </div>

        <p className="signup-login">
          Already a user?
          <button type="button" onClick={() => navigate("/login")}>
            Log in
          </button>
        </p>
      </section>
    </main>
  );
}

export default Signup;
