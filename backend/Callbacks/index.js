const User = require("../Models/User");
const Task = require("../Models/Task");
const Group = require("../Models/Group");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

function getHomePage(req, res) {
  const { id } = req.params;
  return res.status(200).json({ message: id });
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

module.exports = {
  getHomePage,
  signup,
  login,
};
