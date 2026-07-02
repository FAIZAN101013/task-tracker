import "./DeleteConfirmationModal.css";

function DeleteConfirmationModal({ isDeleting, onCancel, onConfirm }) {
  return (
    <div className="delete-modal-overlay" role="presentation">
      <section
        className="delete-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <h2 id="delete-modal-title">Delete Task</h2>

        <p id="delete-modal-description">
          Are you sure you want to permanently delete this task?
        </p>

        <div className="delete-modal-actions">
          <button
            type="button"
            className="delete-cancel-btn"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="delete-confirm-btn"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default DeleteConfirmationModal;
