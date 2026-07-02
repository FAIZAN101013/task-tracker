import "./TaskCard.css";

function TaskCard({ task, onEdit, onDelete }) {
  const { _id, title, description, priority, status, dueDate } = task;

  const priorityClass = priority.toLowerCase();
  const statusClass = status.toLowerCase().replace(/\s+/g, "-");

  return (
    <article className="task-card">
      <div className="task-card-header">
        <h3>{title}</h3>

        <span className={`priority ${priorityClass}`}>{priority}</span>
      </div>

      {description && <p className="task-description">{description}</p>}

      <div className="task-meta">
        <span className={`status ${statusClass}`}>{status}</span>

        {dueDate && (
          <span className="due-date">
            {new Date(dueDate).toLocaleDateString("en-GB")}
          </span>
        )}
      </div>

      <div className="task-actions">
        <button className="edit-btn" onClick={() => onEdit(_id)}>
          Edit
        </button>

        <button
          className="delete-btn"
          onClick={() => onDelete(task)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskCard;
