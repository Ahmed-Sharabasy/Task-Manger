const Task = require("../models/taskModel");

// === Page Rendering ===
exports.renderHomePage = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.render("index", { tasks });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};


const buildErrorResponse = (res, statusCode, message) =>
  res.status(statusCode).json({ success: false, message });

const handleServerError = (res, error) => {
  console.error(error);
  return buildErrorResponse(res, 500, "Internal server error");
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    return res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, completed } = req.body;
    if (!title || !title.trim()) {
      return buildErrorResponse(res, 400, "Title is required");
    }

    const task = await Task.create({
      title: title.trim(),
      completed,
    });

    return res.status(201).json({ success: true, data: task });
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, completed } = req.body;

    // Validate title if it's sent
    if (title !== undefined && !title.trim()) {
      return buildErrorResponse(res, 400, "Title cannot be empty");
    }

    // Build updates object only with allowed fields
    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (completed !== undefined) updates.completed = completed;

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return buildErrorResponse(res, 404, "Task not found");
    }

    return res.status(200).json({ success: true, data: task });
  } catch (error) {
    return handleServerError(res, error);
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return buildErrorResponse(res, 404, "Task not found");
    }

    return res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    return handleServerError(res, error);
  }
};
