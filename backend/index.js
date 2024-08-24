const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const FormDataModel = require("./models/FormData");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect("mongodb://127.0.0.1:27017/delote");

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await FormDataModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await FormDataModel.create({
      ...req.body,
      password: hashedPassword,
    });

    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await FormDataModel.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        res.json("Success");
      } else {
        res.status(400).json("Wrong password");
      }
    } else {
      res.status(404).json("No records found!");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
});
app.listen(8000, () => {
  console.log("server is running on port 8000");
});
