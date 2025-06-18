import { useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import "./Header.css";

function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header>
      <h1>Portfolio Insights</h1>

      {/* User info indicator and logout button, if user is logged in */}
      {user && (
        <div className="user-info">
          <span className="username">Welcome, {user.username}</span>
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
