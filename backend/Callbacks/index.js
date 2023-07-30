const User = require("../Models/User");
const Task = require("../Models/Task");
const Group = require("../Models/Group");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function getHomePage(req, res) {
  try {
    const { id } = req.params;
    const group_details = await Group.find({ users: id });
    const tasks = await Task.find({ group: group_details[0]._id });
    return res.status(200).json({
      group: group_details,
      tasks: tasks,
    });
  } catch (error) {
    return res.status(500).json({ message: false });
  }
}

async function createTask(req, res) {
  const token = req.body.token;
  if (jwt.verify(token, process.env.JWT_SECRET)) {
    try {
      const taskData = { ...req.body };
      delete taskData.token;
      const new_task = new Task(taskData);
      const responsse = await new_task.save();
      return res.status(200).json(responsse);
    } catch (error) {
      return res.status(500).json({ message: false });
    }
  } else {
    return res.status(500).json({ error: "Unauthorized user request" });
  }
}

async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const task = await Task.deleteOne({ _id: id });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
}

async function signup(req, res) {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({
      message: "Please Provide Required Information",
    });
  }
  const hash_password = await bcrypt.hash(password, 10);

  const userData = {
    email,
    username,
    hash_password,
  };

  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      message: "User already registered",
    });
  } else {
    User.create(userData).then((user, err) => {
      if (err) res.status(400).json({ err });
      else {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "30d",
        });
        const { _id, email } = user;
        res.status(200).json({
          message: "User created Successfully",
          token,
          user: { _id, email, username },
        });
      }
    });
  }
}

async function login(req, res) {
  try {
    if (!req.body.email || !req.body.password) {
      res.status(400).json({
        message: "Please enter email and password",
      });
      return;
    }

    const user = await User.findOne({ email: req.body.email });
    const authenticated = await user.authenticate(req.body.password);

    if (user) {
      if (authenticated) {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "30d",
        });
        const { _id, email, username } = user;
        res.status(200).json({
          token,
          user: { _id, email, username },
        });
      } else {
        res.status(400).json({
          message: "Something went wrong!",
        });
      }
    } else {
      res.status(404).json({
        message: "User does not exist..!",
      });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
}

async function updateTaskStatus(req, res) {
  const taskId = req.params.id;
  const { status } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating task status", error: error.message });
  }
}

module.exports = {
  getHomePage,
  signup,
  login,
  createTask,
  deleteTask,
  updateTaskStatus
};
