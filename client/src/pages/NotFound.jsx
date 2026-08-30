import { Link } from "react-router-dom";
import "./Auth.css";

function NotFound() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="auth-eyebrow">404</span>
        <h1>Page not found</h1>
        <p className="auth-subtitle">
          That page does not exist, or it moved somewhere else.
        </p>

        <p className="auth-footer">
          <Link to="/">Back to your tasks</Link>
        </p>
      </div>
    </div>
  );
}

export default NotFound;
