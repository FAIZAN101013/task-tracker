import { useMemo, useState } from "react";
import "./TaskList.css";
import TaskCard from "./TaskCard";

const priorityRank = {
  High: 1,
  Medium: 2,
  Low: 3,
};

const getCreatedTime = (task) => {
  if (task.createdAt) {
    return new Date(task.createdAt).getTime();
  }

  if (task._id) {
    return parseInt(task._id.substring(0, 8), 16) * 1000;
  }

  return 0;
};

function TaskList({
  tasks = [],
  onEdit,
  onDelete,
  onAdd,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Latest");

  const summary = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter((task) => task.status === "Pending").length,
      completed: tasks.filter((task) => task.status === "Completed").length,
      highPriority: tasks.filter((task) => task.priority === "High").length,
    };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return [...tasks]
      .filter((task) => {
        const matchesSearch = (task.title || "")
          .toLowerCase()
          .includes(normalizedSearch);
        const matchesStatus =
          statusFilter === "All" || task.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((firstTask, secondTask) => {
        if (sortBy === "Oldest") {
          return getCreatedTime(firstTask) - getCreatedTime(secondTask);
        }

        if (sortBy === "Priority") {
          return (
            priorityRank[firstTask.priority] - priorityRank[secondTask.priority]
          );
        }

        if (sortBy === "Due Date") {
          const firstDate = firstTask.dueDate
            ? new Date(firstTask.dueDate)
            : new Date("9999-12-31");
          const secondDate = secondTask.dueDate
            ? new Date(secondTask.dueDate)
            : new Date("9999-12-31");

          return firstDate - secondDate;
        }

        return getCreatedTime(secondTask) - getCreatedTime(firstTask);
      });
  }, [searchTerm, sortBy, statusFilter, tasks]);

  return (
    <section className="task-list">
      <div className="dashboard-summary">
        <article className="summary-card">
          <span>Total Tasks</span>
          <strong>{summary.total}</strong>
        </article>

        <article className="summary-card">
          <span>Pending</span>
          <strong>{summary.pending}</strong>
        </article>

        <article className="summary-card">
          <span>Completed</span>
          <strong>{summary.completed}</strong>
        </article>

        <article className="summary-card">
          <span>High Priority</span>
          <strong>{summary.highPriority}</strong>
        </article>
      </div>

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

      {tasks.length > 0 && (
        <div className="task-controls">
          <input
            type="search"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search tasks"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter tasks by status"
          >
            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort tasks"
          >
            <option>Latest</option>
            <option>Oldest</option>
            <option>Priority</option>
            <option>Due Date</option>
          </select>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="task-list-empty">
          <h3>No tasks yet</h3>
          <p>Your task list is ready for its first entry.</p>
          <span>Click Add Task to create your first task.</span>
        </div>
      ) : visibleTasks.length === 0 ? (
        <div className="task-list-empty">
          <h3>No matching tasks</h3>
          <p>Try adjusting your search or status filter.</p>
        </div>
      ) : (
        <div className="task-cards">
          {visibleTasks.map((task) => (
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
