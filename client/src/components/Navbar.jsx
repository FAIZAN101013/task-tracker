import "./Navbar.css";

function Navbar({ theme, onToggleTheme }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-top">
          <h1 className="navbar-title">Task Tracker</h1>

          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label="Toggle color theme"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
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
