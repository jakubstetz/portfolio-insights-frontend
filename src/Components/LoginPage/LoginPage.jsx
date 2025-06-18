import { useState, useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import "./LoginPage.css";

function LoginPage({ apiUrl }) {
  const [isLogin, setIsLogin] = useState(true); // true = login, false = register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleGuestLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const formData = new URLSearchParams();
      formData.append("username", "Guest");
      formData.append("password", "GuestPassword");

      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Guest login failed");
      }

      login(data.access_token, { username: "Guest" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Handle login
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        const response = await fetch(`${apiUrl}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Login failed");
        }

        login(data.access_token, { username });
      } else {
        // Handle registration
        const response = await fetch(`${apiUrl}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Registration failed");
        }

        login(data.token.access_token, data.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Register"}</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <button
          type="button"
          className="auth-button guest-button"
          onClick={handleGuestLogin}
          disabled={loading}
        >
          Use Guest Account
        </button>

        <div className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            className="auth-switch-button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
