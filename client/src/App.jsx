import { useEffect, useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

import API from "./services/api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get("/tasks");
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // CREATE
  const addTask = async (taskData) => {
    try {
      await API.post("/tasks", taskData);
      await fetchTasks();

      setShowForm(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // UPDATE
  const updateTask = async (taskData) => {
    try {
      await API.put(`/tasks/${selectedTask._id}`, taskData);

      await fetchTasks();

      setShowForm(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // DELETE
  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== id)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
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
      <Navbar />

      <main className="container">
        <TaskList
          tasks={tasks}
          onAdd={() => {
            setSelectedTask(null);
            setShowForm(true);
          }}
          onEdit={handleEdit}
          onDelete={deleteTask}
        />
      </main>

      {showForm && (
        <>
          <div
            className="modal-overlay"
            onClick={() => {
              setShowForm(false);
              setSelectedTask(null);
            }}
          />

          <TaskForm
            onClose={() => {
              setShowForm(false);
              setSelectedTask(null);
            }}
            onTaskAdded={selectedTask ? updateTask : addTask}
            initialData={selectedTask}
          />
        </>
      )}
    </>
  );
}

export default App;