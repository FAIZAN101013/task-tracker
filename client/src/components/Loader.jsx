import "./Loader.css";

function Loader({ label = "Loading" }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader-spinner" aria-hidden="true" />
      <p className="loader-label">{label}</p>
    </div>
  );
}

export default Loader;
