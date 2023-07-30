const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();
const routes = require("./Callbacks/index");

//Database connection
(async () => {
  await mongoose.connect(
    "mongodb+srv://alikhantareen:Pakistan786@cluster0.po7h8av.mongodb.net/funfox"
  );
  console.log("MongoDB connected");
})();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/home/:id", routes.getHomePage);
app.post("/signup", routes.signup);
app.post("/login", routes.login);
app.post("/createtask", routes.createTask);
app.delete("/task/:id", routes.deleteTask);
app.put("/updatestatus/:id", routes.updateTaskStatus);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
});
