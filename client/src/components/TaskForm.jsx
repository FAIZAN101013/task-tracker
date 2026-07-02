import { useState } from "react";
import "./TaskForm.css";

const getTodayValue = () => new Date().toISOString().split("T")[0];

const validateField = (name, value) => {
  const trimmedValue = typeof value === "string" ? value.trim() : value;

  if (name === "title") {
    if (!trimmedValue) {
      return "Title is required.";
    }

    if (trimmedValue.length < 3) {
      return "Title must be at least 3 characters.";
    }
  }

  if (name === "description" && value.length > 250) {
    return "Description must be 250 characters or less.";
  }

  if (name === "dueDate" && value && value < getTodayValue()) {
    return "Due Date cannot be before today.";
  }

  return "";
};

const validateForm = (formData) => {
  return ["title", "description", "dueDate"].reduce((errors, fieldName) => {
    const error = validateField(fieldName, formData[fieldName]);

    if (error) {
      errors[fieldName] = error;
    }

    return errors;
  }, {});
};

const getInitialFormData = (initialData) => {
  if (!initialData) {
    return {
      title: "",
      description: "",
      status: "Pending",
      priority: "Low",
      dueDate: "",
    };
  }

  return {
    title: initialData.title || "",
    description: initialData.description || "",
    status: initialData.status || "Pending",
    priority: initialData.priority || "Low",
    dueDate: initialData.dueDate
      ? initialData.dueDate.substring(0, 10)
      : "",
  };
};

function TaskForm({ onClose, onTaskAdded, initialData, isSaving }) {
  const [formData, setFormData] = useState(() =>
    getInitialFormData(initialData)
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Only show live validation after a field has already reported an error.
    setErrors((prev) => {
      if (!prev[name]) {
        return prev;
      }

      const nextError = validateField(name, value);
      const nextErrors = { ...prev };

      if (nextError) {
        nextErrors[name] = nextError;
      } else {
        delete nextErrors[name];
      }

      return nextErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSaving) {
      return;
    }

    const nextErrors = validateForm(formData);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      await onTaskAdded(formData);

      setFormData(getInitialFormData());

      onClose();
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  const isEditing = Boolean(initialData);

  return (
    <section className="task-form">
      <div className="task-form-header">
        <div>
          <span className="task-form-eyebrow">new entry</span>

          <h2>{isEditing ? "Update Task" : "Add Task"}</h2>
        </div>

        <button
          type="button"
          className="close-btn"
          onClick={onClose}
          disabled={isSaving}
          aria-label="Close task form"
        >
          x
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="title">Title</label>

          <input
            id="title"
            name="title"
            type="text"
            placeholder="What needs doing?"
            value={formData.title}
            onChange={handleChange}
            disabled={isSaving}
            className={errors.title ? "field-invalid" : ""}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "title-error" : undefined}
          />

          {errors.title && (
            <small className="field-error" id="title-error">
              {errors.title}
            </small>
          )}
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
            disabled={isSaving}
            className={errors.description ? "field-invalid" : ""}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? "description-error" : undefined
            }
          />

          {errors.description && (
            <small className="field-error" id="description-error">
              {errors.description}
            </small>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={isSaving}
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
              disabled={isSaving}
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
              disabled={isSaving}
              className={errors.dueDate ? "field-invalid" : ""}
              aria-invalid={Boolean(errors.dueDate)}
              aria-describedby={errors.dueDate ? "dueDate-error" : undefined}
            />

            {errors.dueDate && (
              <small className="field-error" id="dueDate-error">
                {errors.dueDate}
              </small>
            )}
          </div>

          <div className="form-group button-group">
            <label>&nbsp;</label>

            <button type="submit" className="btn" disabled={isSaving}>
              {isSaving
                ? isEditing
                  ? "Updating..."
                  : "Adding..."
                : isEditing
                  ? "Update Task"
                  : "Add Task"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default TaskForm;
