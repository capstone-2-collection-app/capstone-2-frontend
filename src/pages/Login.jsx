import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
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
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <button className="forgot-password" type="button">
            Forgot password?
          </button>

          <button className="login-submit" type="submit">
            Log in
          </button>
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
