// models/user.js
import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed password
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema, "users");
