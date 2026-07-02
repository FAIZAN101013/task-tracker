import { useEffect, useState } from "react";
import "./TaskForm.css";

function TaskForm({ onClose, onTaskAdded, initialData }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Low",
    dueDate: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status || "Pending",
        priority: initialData.priority || "Low",
        dueDate: initialData.dueDate
          ? initialData.dueDate.substring(0, 10)
          : "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "Pending",
        priority: "Low",
        dueDate: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await onTaskAdded(formData);

      setFormData({
        title: "",
        description: "",
        status: "Pending",
        priority: "Low",
        dueDate: "",
      });

      onClose();
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  return (
    <section className="task-form">
      <div className="task-form-header">
        <div>
          <span className="task-form-eyebrow">new entry</span>

          <h2>
            {initialData ? "Update Task" : "Add Task"}
          </h2>
        </div>

        <button
          type="button"
          className="close-btn"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>

          <input
            id="title"
            name="title"
            type="text"
            placeholder="What needs doing?"
            required
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>

          <textarea
            id="description"
            name="description"
            rows="4"
            placeholder="Add any details"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>

            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>

        <div className="form-row form-row-bottom">
          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>

            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group button-group">
            <label>&nbsp;</label>

            <button
              type="submit"
              className="btn"
            >
              {initialData ? "Update Task" : "Add Task"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default TaskForm;