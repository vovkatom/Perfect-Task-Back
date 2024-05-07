import express from "express";
import { userSignupSchema, userSigninSchema } from "../schemas/usersSchemas.js";
import authControllers from "../controllers/authControler.js";
import googleControler from "../controllers/googleControler.js";
import validateBody from "../decorators/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

import emailHelp from "../controllers/emailHelpController.js";
import emailHelpShemas from "../schemas/emailHelpShemas.js";

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

// authRouter.post("/signout", authenticate, authControllers.signout);

authRouter.patch(
  "/update",
  authenticate,
  upload.single("avatarURL"),
  authControllers.updateAuth
);

authRouter.post("/logout", authenticate, authControllers.logout);
authRouter.get("/google", googleControler.googleAuth);
authRouter.get("/google-redirect", googleControler.googleRedirect);
authRouter.post("/support",authenticate, validateBody(emailHelpShemas), emailHelp);

export default authRouter;
