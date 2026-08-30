import Task from "../models/Task.js";

// Every query is scoped to req.user so one account can never read or
// modify another account's tasks, even with a valid task id.

// @desc    Get all tasks belonging to the logged in user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json(tasks);
};

// @desc    Get a single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.status(200).json(task);
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
    user: req.user._id,
  });

  res.status(201).json(task);
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { title, description, status, priority, dueDate },
    { new: true, runValidators: true }
  );

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.status(200).json(task);
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.status(200).json({ message: "Task deleted successfully" });
};
