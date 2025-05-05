import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  content: String,
  done: Boolean,
  created_at: Date,
});
