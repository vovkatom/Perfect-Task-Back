import express from "express";
import { userSignupSchema, userSigninSchema } from "../schemas/usersSchemas.js";
import authController from "../controllers/authControler.js";
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
  authController.signup
);

authRouter.post(
  "/signin",
  validateBody(userSigninSchema),
  authController.signin
);

authRouter.patch(
  "/update",
  authenticate,
  upload.single("avatarURL"),
  authController.updateAuth
);

authRouter.post("/logout", authenticate, authController.logout);
authRouter.get("/google", googleControler.googleAuth);
authRouter.get("/google-redirect", googleControler.googleRedirect);

authRouter.post("/support",authenticate, validateBody(emailHelpShemas), emailHelp);

authRouter.get("/current", authenticate, authController.getCurrent);


export default authRouter;
