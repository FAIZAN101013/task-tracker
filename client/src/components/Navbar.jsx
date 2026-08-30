import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext";
import "./Navbar.css";

// Two initials for the avatar, e.g. "Ada Lovelace" -> "AL"
const getInitials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

function Navbar({ theme, onToggleTheme }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("You have been logged out.");
    navigate("/login", { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-top">
          <Link to="/" className="navbar-brand">
            <h1 className="navbar-title">Task Tracker</h1>
          </Link>

          <div className="navbar-actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={onToggleTheme}
              aria-label="Toggle color theme"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>

            {user && (
              <>
                <Link to="/profile" className="navbar-user" title="Account settings">
                  <span className="navbar-avatar" aria-hidden="true">
                    {getInitials(user.name)}
                  </span>
                  <span className="navbar-username">{user.name}</span>
                </Link>

                <button type="button" className="theme-toggle" onClick={handleLogout}>
                  Log out
                </button>
              </>
            )}
          </div>
        </div>

        <div className="navbar-ticks" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="tick" />
          ))}
        </div>
        <p className="navbar-tagline">manage your daily tasks, efficiently</p>
      </div>
    </header>
  );
}

export default Navbar;
