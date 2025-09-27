// models/user.js
import mongoose, {Schema} from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name field is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    }, // hashed password
    role: {
      type: String,
      default: "user",
    },
  },
  {timestamps: true}
);

export default mongoose.model("User", UserSchema, "users");
