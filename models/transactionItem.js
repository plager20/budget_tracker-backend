const mongoose = require("mongoose");
const validator = require("validator");

const transactionItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true,
    minlength: 1,
  },
  type: {
    type: String,
    required: [true, "Must enter income or expense"],
    enum: ["income", "expense"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    require: true,
  },
});

module.exports = mongoose.model("item", transactionItemSchema);
