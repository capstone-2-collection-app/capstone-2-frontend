import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

function Signup() {
  const navigate = useNavigate();
  const { signup, isLoading, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupStatus, setLoginStatus] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const signupInfo = await signup(name, email, password);
    if (signupInfo) {
      setName("");
      setEmail("");
      setPassword("");
      setLoginStatus("Account Registered.");
      navigate("/home");
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
          <p>{signupStatus}</p>
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
