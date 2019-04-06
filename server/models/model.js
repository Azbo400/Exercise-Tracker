const mongoose = require('mongoose');
const { Schema } = mongoose; 

const UserExerciseSchema = new Schema({
  _id: String, 
  username: String, 
  description: String, 
  duration: Number, 
  date: String
});

mongoose.model("UserExercise", UserExerciseSchema);