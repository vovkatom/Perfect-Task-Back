import express from "express";
import { userSignupSchema, userSigninSchema } from "../schemas/usersSchemas.js";
import authControllers from "../controllers/authControlers.js";
import googleControler from "../controllers/googleControler.js";
import validateBody from "../decorators/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  validateBody(userSignupSchema),
  authControllers.signup
);

authRouter.post(
  "/signin",
  validateBody(userSigninSchema),
  authControllers.signin
);

authRouter.post("/signout", authenticate, authControllers.signout);

authRouter.patch(
  "/update",
  authenticate,
  upload.single("avatarURL"),
  authControllers.updateAuth
);

// authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.signout);

export default authRouter;

// const googleRouter = express.Router();
authRouter.get("/google", googleControler.googleAuth);
authRouter.get("/google-redirect", googleControler.googleRedirect);
