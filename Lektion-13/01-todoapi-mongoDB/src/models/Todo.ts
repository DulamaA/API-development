import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
});
