import express from "express";
import signup from "../controllers/AuthController.js";
import user from "../models/user.js";
import {
  signupValidation,
  loginValidation,
} from "../MiddleWare/AuthValidation.js";
import loginController from "../controllers/loginController.js";

const router = express.Router();

router.post("/login", loginValidation, loginController);

router.post("/signup", signupValidation, signup);

//
router.get("/data/:email", async (req, res, next) => {
  try {
    // geting the mail from the user side
    const {email} = req.params; // through the params

    if (!email) {
      // error handleing for email
      return res
        .status(400)
        .json({success: false, message: "Email is required"});
    }

    // Find user by email
    const foundUser = await user.findOne({email});

    if (!foundUser) {
      // this will not happen because calling after the user SignUp
      return res.status(404).json({success: false, message: "User not found"});
    }

    // sending the userfound to the frontend
    res.status(200).json({
      success: true,
      data: foundUser,
    });
  } catch (err) {
    // middleware for unexpected errors
    next(err);
  }
});

// only use if you want to delete all the data of the database
// router.delete("/ninjas", async (req, res, next) => {
//   try {
//     // if (req.query.confirm !== "true") {
//     //   return res.status(400).json({
//     //     error: "You must pass ?confirm=true to delete all ninjas"
//     //   });
//     // }

//     // actually delete
//     const result = await user.deleteMany({});

//     // return number deleted (200 OK). You can also use 204 No Content but then no body allowed.
//     res.status(200).json({
//       success: true,
//       deletedCount: result.deletedCount,
//     });
//   } catch (err) {
//     next(err);
//   }
// });

export default router;
