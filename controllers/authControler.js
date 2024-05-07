import bcrypt from "bcrypt";
import * as authServices from "../services/authServices.js";
import jwt from "jsonwebtoken";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import uploadToCloudinary from "../helpers/uploadToCloudinary.js";
import gravatar from "gravatar";
import "dotenv/config";

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { password, email } = req.body;
  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const gravatar_url = gravatar.url(
    email,
    { s: "250", r: "x", d: "identicon" },
    true
  );

  const newUser = await authServices.signup({
    ...req.body,
    password: hashPassword,
    avatarURL: gravatar_url,
  });
  const { _id: id } = newUser;

  const payload = {
    id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

  await authServices.updateUser(
    { _id: id },
    {
      token,
    }
  );

  res.status(201).json({
    token,
    user: {
      email: newUser.email,
      name: newUser.name,
    },
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;

  const payload = {
    id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await authServices.updateUser({ _id: id }, { token });

  res.json({
    token,
    user: {
      email: user.email,
      name: user.name,
    },
  });
};

export const updateAuth = async (req, res) => {
  const { _id: id } = req.user;
  const { email } = req.body;
  const user = await authServices.findUser({ _id: id });

  let gravatar_url = "";

  if (req.file) {
    gravatar_url = await uploadToCloudinary(req);
  } else if (!user.avatarURL.includes("cloudinary.com")) {
    gravatar_url = gravatar.url(
      email,
      { s: "250", r: "x", d: "identicon" },
      true
    );
  } else {
    gravatar_url = user.avatarURL;
  }

  const newUser = await authServices.updateUser(
    { _id: id },
    {
      ...req.body,
      avatarURL: gravatar_url,
    }
  );
  console.log("TWO", newUser);
  res.status(200).json({
    user: {
      email: newUser.email,
      name: newUser.name,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await authServices.updateUser({ _id }, { token: "" });

  res.status(204).json({
    message: "Logout success",
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  updateAuth: ctrlWrapper(updateAuth),
  logout: ctrlWrapper(logout),
};
