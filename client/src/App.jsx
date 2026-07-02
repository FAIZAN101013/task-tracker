import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";

import Navbar from "./components/Navbar";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

import API from "./services/api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("taskTrackerTheme") || "light";
  });

  const fetchTasks = async () => {
    try {
      const { data } = await API.get("/tasks");
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    API.get("/tasks")
      .then(({ data }) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("taskTrackerTheme", theme);
  }, [theme]);

  const closeForm = () => {
    setShowForm(false);
    setSelectedTask(null);
  };

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  };

  // CREATE
  const addTask = async (taskData) => {
    setIsSaving(true);

    try {
      await API.post("/tasks", taskData);
      await fetchTasks();

      closeForm();
      toast.success("Task created successfully.");
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Unable to create task.");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // UPDATE
  const updateTask = async (taskData) => {
    setIsSaving(true);

    try {
      await API.put(`/tasks/${selectedTask._id}`, taskData);

      await fetchTasks();

      closeForm();
      toast.success("Task updated successfully.");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Unable to update task.");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // DELETE
  const deleteTask = async (id) => {
    setIsDeleting(true);

    try {
      await API.delete(`/tasks/${id}`);

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== id)
      );
      setTaskToDelete(null);
      toast.success("Task deleted successfully.");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Unable to delete task.");
    } finally {
      setIsDeleting(false);
    }
  };

  // EDIT
  const handleEdit = (id) => {
    const task = tasks.find((task) => task._id === id);

    setSelectedTask(task);
    setShowForm(true);
  };

  return (
    <>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.82rem",
            boxShadow: "0 10px 30px rgba(26, 31, 46, 0.12)",
          },
          success: {
            icon: null,
          },
          error: {
            icon: null,
          },
        }}
      />

      <main className="container">
        <TaskList
          tasks={tasks}
          onAdd={() => {
            setSelectedTask(null);
            setShowForm(true);
          }}
          onEdit={handleEdit}
          onDelete={setTaskToDelete}
        />
      </main>

      {showForm && (
        <>
          <div
            className="modal-overlay"
            onClick={isSaving ? undefined : closeForm}
          />

          <TaskForm
            key={selectedTask?._id || "new-task"}
            onClose={closeForm}
            onTaskAdded={selectedTask ? updateTask : addTask}
            initialData={selectedTask}
            isSaving={isSaving}
          />
        </>
      )}

      {taskToDelete && (
        <DeleteConfirmationModal
          isDeleting={isDeleting}
          onCancel={() => setTaskToDelete(null)}
          onConfirm={() => deleteTask(taskToDelete._id)}
        />
      )}
    </>
  );
}

export default App;
