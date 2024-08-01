const express = require("express");

const bcrypt = require("bcrypt");

const router = express.Router();

//get a user
router.get("/users/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let foundUser = await User.findById(id);
    if (!foundUser) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send(foundUser);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
//get all users
router.get("/users", async (req, res) => {
  try {
    let allUsers = await User.find();
    if (!allUsers) {
      res.status(404).send("Users not found");
    } else {
      res.status(200).send(allUsers);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//create a user
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: "Username already exists" });
    }
    // hash the password
    let hashedPassword = await bcrypt.hash(password, 10);

    //create new user
    const newUser = new User({ username, hashedPassword });
    await newUser.save();

    res.status(201).send(newUser);
  } catch (error) {
    console.log("error" + error);
    res.status(400).send(error); //
  }
});
//update user
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { username, password } = req.body;
    let hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, hashedPassword },
      { new: true }
    );
    if (!updatedUser) {
      //create user
      const newUser = new User({ username, hashedPassword });
      await newUser.save();
      res.status(201).send(newUser);
      //or should i just return error cuz id doesnt exist
      //res.status(404).send("User not Found")
    } else {
      res.status(200).send(updatedUser);
    }
  } catch (error) {
    console.log("error" + error);
    res.status(400).send(error); //
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let foundUser = await User.findByIdAndDelete(id);
    if (!foundUser) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send("User deleted successfully");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
