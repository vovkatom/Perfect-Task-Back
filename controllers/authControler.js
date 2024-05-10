import bcrypt from "bcrypt";
import * as authServices from "../services/authServices.js";
import jwt from "jsonwebtoken";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import uploadToCloudinary from "../helpers/uploadToCloudinary.js";
import gravatar from "gravatar";
import "dotenv/config";

const { ACCESS_JWT_SECRET, REFRESH_JWT_SECRET } = process.env;

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

  const accessToken = jwt.sign(payload, ACCESS_JWT_SECRET, { expiresIn: "2m" });
  const refreshToken = jwt.sign(payload, REFRESH_JWT_SECRET, {
    expiresIn: "7d",
  });

  await authServices.updateUser(
    { _id: id },
    {
      accessToken,
      refreshToken,
    }
  );

  res.status(201).json({
    accessToken,
    refreshToken,
    user: {
      email: newUser.email,
      name: newUser.name,
      avatarURL: newUser.avatarURL,
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

  const accessToken = jwt.sign(payload, ACCESS_JWT_SECRET, { expiresIn: "7d" });
  const refreshToken = jwt.sign(payload, REFRESH_JWT_SECRET, {
    expiresIn: "7d",
  });
  await authServices.updateUser({ _id: id }, { accessToken, refreshToken });

  res.json({
    accessToken,
    refreshToken,
    user: {
      email: user.email,
      name: user.name,
      avatarURL: user.avatarURL,
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

  res.status(200).json({
    user: {
      email: newUser.email,
      name: newUser.name,
      avatarURL: newUser.avatarURL,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await authServices.updateUser({ _id }, { accessToken: "", refreshToken: "" });

  res.status(204).json({
    message: "Logout success",
  });
};

const getCurrent = (req, res) => {
  const { name, email, avatarURL, refreshToken, accessToken } = req.user;

  res.json({
    accessToken,
    refreshToken,
    user: {
      email,
      name,
      avatarURL,
    },
  });
};

const refresh = async (req, res) => {
  const { refreshToken: token } = req.body;
  console.log("FFFFFFFFFFFFFFFFFFf");
  try {
    const { id } = jwt.verify(token, REFRESH_JWT_SECRET);
    console.log("hddddddddddddddd", id);
    const isExist = await authServices.findUser({ refreshToken: token });
    if (!isExist) {
      throw HttpError(403, "Token invalid");
    }
    const payload = {
      id,
    };
    const accessToken = jwt.sign(payload, ACCESS_JWT_SECRET, {
      expiresIn: "7d",
    });
    const refreshToken = jwt.sign(payload, REFRESH_JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("check", accessToken);
    await authServices.updateUser({ _id: id }, { accessToken, refreshToken });
    res.json({ accessToken, refreshToken });
  } catch (error) {
    throw HttpError(403, error.message);
  }
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  updateAuth: ctrlWrapper(updateAuth),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  refresh: ctrlWrapper(refresh),
};
