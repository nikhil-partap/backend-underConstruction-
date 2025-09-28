// MiddleWare/AuthValidation.js
import Joi from "joi";

// schema for the signup
export const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(40).required(),
  });

  const {error} = schema.validate(req.body);
  // error handdleing
  if (error) {
    return res.status(400).json({message: "Bad Request", error: error.details});
  }
  next();
};

// defining the schema for login
export const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(40).required(),
  });

  const {error} = schema.validate(req.body, {abortEarly: false});

  // error handleing
  if (error) {
    return res.status(400).json({message: "Bad Request", error: error.details}); // if error on the frontend not working or i am not able to figureout where the error and just want the old error handeling then reverse  this  - (error: error.details)- to -(error)
  }
  next();
};
