import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading, loginAsGuest } = useAuth();
  const [loginStatus, setLoginStatus] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const loginInfo = await login(email, password);
    if (loginInfo) {
      setEmail("");
      setPassword("");
      setLoginStatus("Login Success");
      navigate("/");
    }
  }

  async function handleGuestLogin() {
    const guestInfo = await loginAsGuest();
    if (guestInfo) {
      navigate("/home");
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Log in</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="text"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          <span>
            <button className="login-submit" type="submit" disabled={isLoading}>
              Log in
            </button>
            <button
              className="login-submit"
              onClick={handleGuestLogin}
              disabled={isLoading}
            >
              Guest
            </button>
          </span>

          {error && <div>{error}</div>}
          <p>{loginStatus}</p>
        </form>

        <p className="login-register">
          Not a user?
          <button type="button" onClick={() => navigate("/signup")}>
            Register here
          </button>
        </p>
      </section>
    </main>
  );
}

export default Login;
