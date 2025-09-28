// controllers/AuthController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";
// import User from "../models/user.js"; // use the proper User model
// import {configDotenv} from "dotenv";

const signup = async (req, res, next) => {
  try {
    const {name, email, password} = req.body;

    // check if user exists
    const existing = await UserModel.findOne({email});
    if (existing) {
      return res
        .status(409)
        .json({message: "User already exists, you can login", success: false});
    }

    // bcrypting the user pass
    const hashedPassword = await bcrypt.hash(password, 10);

    // if the user is new to the site add it to the database
    const newUser = new UserModel({name, email, password: hashedPassword});
    await newUser.save();

    const token = jwt.sign(
      {id: newUser._id, email: newUser.email, role: newUser.role},
      process.env.JWT_SECRET || "devsecret",
      {expiresIn: "7d"}
    );

    // sending success if the newuser is made
    res.status(201).json({
      message: "SignUp success",
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    // forward to centralized error handler
    next(error);
  }
};

export default signup;
