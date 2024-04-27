//initialising required dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto")
const nodemailer = require("nodemailer")

const app = express();
const port = 3000; //choosing the specific port
const cors = require("cors"); //protocol that defines some rules for sharing resources from a different origin
app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//jwt is required for logging in
const jwt = require("jsonwebtoken");

//connect method in mongoose connects to backend
mongoose.connect("mongodb+srv://gardnerrobj:gardnerrobj@cluster0.sozyhwf.mongodb.net/").then(() => {
    console.log("Connected to database")
}).catch((error) => {
    console.log("Error connecting to database",error)
});

app.listen(port, () => {
    console.log("Server running on port 3000")
});

const Habit = require("./models/habit")

//endpoint to create a kick in the backend
app.post("/habits", async (req, res) => {
    try {
      const { title, color, repeatMode, reminder } = req.body;
  
      const newHabit = new Habit({
        title,
        color,
        repeatMode,
        reminder,
      });
  
      const savedHabit = await newHabit.save();
      res.status(200).json(savedHabit);
    } catch (error) {
      res.status(500).json({ error: "Network error" });
    }
  });

  app.get("/habitslist",async(req,res) => {
    try{
      const allHabits = await Habit.find({});

      res.status(200).json(allHabits)
    } catch(error){
      res.status(500).json({error:error.message})
    }
  })

  app.put("/habits/:habitId/completed", async (req, res) => {
    const habitId = req.params.habitId;
    const updatedCompletion = req.body.completed; // The updated completion object
  
    try {
      const updatedHabit = await Habit.findByIdAndUpdate(
        habitId,
        { completed: updatedCompletion },
        { new: true }
      );
  
      if (!updatedHabit) {
        return res.status(404).json({ error: "Habit not found" });
      }
  
      return res.status(200).json(updatedHabit);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
  
  app.delete("/habits/:habitId", async (req, res) => {
    try {
      const { habitId } = req.params;
  
      await Habit.findByIdAndDelete(habitId);
  
      res.status(200).json({ message: "Kick deleted succusfully" });
    } catch (error) {
      res.status(500).json({ error: "Unable to delete the kick" });
    }
  });