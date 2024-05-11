import queryString from "query-string";
import axios from "axios";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";
import * as authServices from "../services/authServices.js";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import "dotenv/config";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  BASE_URL,
  FRONTEND_URL,
  ACCESS_JWT_SECRET,
  REFRESH_JWT_SECRET,
} = process.env;

const googleAuth = async (req, res) => {
  const stringifiedParams = queryString.stringify({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${BASE_URL}/users/google-redirect`,
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });
  return res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
  );
};

const googleRedirect = async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const urlObj = new URL(fullUrl);
  const urlParams = queryString.parse(urlObj.search);
  const code = urlParams.code;
  const tokenData = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: "post",
    data: {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: `${BASE_URL}/users/google-redirect`,
      grant_type: "authorization_code",
      code,
    },
  });

  const userData = await axios({
    url: "https://www.googleapis.com/oauth2/v2/userinfo",
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });

  const { email: emailGoogle, name: nameGoogle } = userData.data;
  let tokenGoogle = {};
  try {
    tokenGoogle = await signupGoogle({ name: nameGoogle, email: emailGoogle });
  } catch (error) {
    throw HttpError(500, "Server Error");
  }
  return res.redirect(
    `${FRONTEND_URL}?accessToken=${tokenGoogle.accessToken}&refreshToken=${tokenGoogle.refreshToken}`
  );
};

const signupGoogle = async (req, res) => {
  const { email } = req;

  const gravatar_url = gravatar.url(
    email,
    { s: "250", r: "x", d: "identicon" },
    true
  );

  const user = await authServices.findUser({ email });

  if (user) {
    const { idUser } = user;
    const payload = { idUser };
    const tokenAccessForGoogle = jwt.sign(payload, ACCESS_JWT_SECRET, {
      expiresIn: "23h",
    });
    const tokenRefreshForGoogle = jwt.sign(payload, REFRESH_JWT_SECRET, {
      expiresIn: "23h",
    });
    await authServices.updateUser(
      { _id: idUser },
      { accessToken: tokenAccessForGoogle, refreshToken: tokenRefreshForGoogle }
    );
    return {
      accessToken: tokenAccessForGoogle,
      refreshToken: tokenRefreshForGoogle,
    };
  }
  const password = await bcrypt.hash(nanoid(), 10);
  const newUser = await authServices.signup({
    ...req,
    avatarURL: gravatar_url,
    password,
  });
  const { _id: id } = newUser;
  const payload = {
    id,
  };

  const tokenAccessToken = jwt.sign(payload, ACCESS_JWT_SECRET, {
    expiresIn: "23h",
  });
  const tokenRefreshToken = jwt.sign(payload, REFRESH_JWT_SECRET, {
    expiresIn: "23h",
  });

  await authServices.updateUser(
    { _id: id },
    { accessToken: tokenAccessToken, refreshToken: tokenRefreshToken }
  );
  return { accessToken: tokenAccessToken, refreshToken: tokenRefreshToken };
};

export default {
  googleAuth: ctrlWrapper(googleAuth),
  googleRedirect: ctrlWrapper(googleRedirect),
};
