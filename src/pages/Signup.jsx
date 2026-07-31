import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    // We will connect the signup API here next.
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
              autoComplete="name"
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              required
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
              required
            />
          </div>

          <button className="signup-submit" type="submit">
            Create account
          </button>
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
