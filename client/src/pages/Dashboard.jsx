import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import Loader from "../components/Loader";

import API from "../services/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get("/tasks");
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Unable to load your tasks.");
    }
  };

  useEffect(() => {
    let ignore = false;

    API.get("/tasks")
      .then(({ data }) => {
        if (!ignore) setTasks(data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        toast.error("Unable to load your tasks.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const closeForm = () => {
    setShowForm(false);
    setSelectedTask(null);
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

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
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

  if (isLoading) {
    return <Loader label="Loading your tasks" />;
  }

  return (
    <>
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

export default Dashboard;
