import express from "express";
import {
  userSignupSchema,
  userSigninSchema,
  // userEmailSchema,
} from "../schemas/usersSchemas.js";
// import { subscriptionSchema } from "../schemas/contactsSchemas.js";
import authControllers from "../controllers/authControlers.js";
import validateBody from "../decorators/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  // validateBody(userSignupSchema),
  upload.single("avatarURL"),
  authControllers.signup
);

authRouter.post(
  "/login",
  validateBody(userSigninSchema),
  authControllers.signin
);

// authRouter.get("/current", authenticate, authControllers.getCurrent);

// authRouter.post("/logout", authenticate, authControllers.signout);

export default authRouter;
