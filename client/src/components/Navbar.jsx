import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">Task Tracker</h1>
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