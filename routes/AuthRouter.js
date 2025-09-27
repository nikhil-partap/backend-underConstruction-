import express from "express";
import signup from "../controllers/AuthController.js";
import {
  signupValidation,
  loginValidation,
} from "../MiddleWare/AuthValidation.js";
import loginController from "../controllers/loginController.js";

const router = express.Router();

router.post("/login", loginValidation, loginController);

router.post("/signup", signupValidation, signup);

export default router;
