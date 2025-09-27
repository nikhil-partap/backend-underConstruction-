import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.js"; // use the proper User model
import User from "../models/user.js"; // use the proper User model
import {configDotenv} from "dotenv";

const signup = async (req, res, next) => {
  try {
    const {name, email, password} = req.body;

    // checking if the user already exist
    const user = await UserModel.findOne({email});
    if (user) {
      return res.status(409).json({
        message: "User already exists, you can login",
        success: false,
      });
    }

    // bcrypting the user pass
    const hashedPassword = await bcrypt.hash(password, 10);
    // if the user does not exist add it to the database
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

    // error handling
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
    next(error);
  }
};

// refer to /controllers/loginController.js
// const loginController = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(403).json({ message: "Invalid email or the account doesnot exist", success: false });
//     }

//     const passCompare = await bcrypt.compare(password, user.password);
//     if (!passCompare) {
//       return res.status(401).json({ message: "Invalid Passoword", success: false });
//     }

//     // sign a JWT (example). Put a secret in process.env.JWT_SECRET
//     const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || "devsecret", {
//       expiresIn: "7d",
//     });

//     return res.status(200).json({ success: true, token });
//   } catch (err) {
//     next(err);
//   }
// };

export default signup;
