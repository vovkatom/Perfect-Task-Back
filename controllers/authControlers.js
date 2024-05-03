import bcrypt from "bcrypt";
import * as authServices from "../services/authServices.js";
import jwt from "jsonwebtoken";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import uploadToCloudinary from "../helpers/uploadToCloudinary.js";
import gravatar from "gravatar";

const signup = async (req, res) => {
    const { password, email } = req.body;
    const user = await authServices.findUser({ email });
    if (user) {
        throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await authServices.signup({
        ...req.body,
        password: hashPassword,
    });
    const { _id: id } = newUser;
    // const gravatar_url = gravatar.url(email, { s: "250", r: "g" }, true);

    const gravatar_url = await gravatar.url(
        email,
        { s: "250", r: "x", d: "robohash" },
        true
    );

    // req.file.path = gravatar_url;
    // const secure_url = await uploadToCloudinary(req, id);
    //const secure_url = gravatar_url;

    const payload = {
        id,
    };

    const { JWT_SECRET } = process.env;
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

    await authServices.updateUser(
        { _id: id },
        {
            // avatarURL: secure_url,
            avatarURL: gravatar_url,
            token,
        }
    );

    res.status(201).json({
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

    const { JWT_SECRET } = process.env;
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

export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
};
