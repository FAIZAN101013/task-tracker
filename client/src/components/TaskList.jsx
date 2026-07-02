import "./TaskList.css";
import TaskCard from "./TaskCard";

function TaskList({
  tasks = [],
  onEdit,
  onDelete,
  onAdd,
}) {
  return (
    <section className="task-list">

      <div className="task-list-header">

        <div>
          <span className="task-list-eyebrow">
            {tasks.length} Total
          </span>

          <h2>My Tasks</h2>
        </div>

        <button
          className="open-modal-btn"
          onClick={onAdd}
        >
          + Add Task
        </button>

      </div>

      {tasks.length === 0 ? (
        <p className="task-list-empty">
          No tasks yet — click <strong>+ Add Task</strong> to create your first task.
        </p>
      ) : (
        <div className="task-cards">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default TaskList;