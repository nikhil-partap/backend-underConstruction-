// controllers/loginController.js
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

const loginController = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) {
      return res.status(403).json({
        message: "Invalid email or account does not exist",
        success: false,
      });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res
        .status(401)
        .json({message: "Invalid Password", success: false});
    }

    // sign a JWT (example). Put a secret in process.env.JWT_SECRET
    const token = jwt.sign(
      {id: user._id, email: user.email},
      process.env.JWT_SECRET || "devsecret",
      {expiresIn: "7d"}
    );

    return res.status(200).json({name: user.name, success: true, token});
  } catch (err) {
    next(err);
  }
};

export default loginController;
