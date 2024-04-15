import createHttpError from "http-errors";
import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getConfig } from "../../config/index.js";

export class Auth {
  constructor() {}

  ACCESS_TOKEN_SECRET = getConfig("ACCESS_TOKEN_SECRET");
  REFRESH_TOKEN_SECRET = getConfig("REFRESH_TOKEN_SECRET");

  // login
  login = async (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      const err = createHttpError(400, "Please preovide required fields");
      return next(err);
    }

  };

  // register
  register = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      const err = createHttpError(400, "Please enter required fields");
      return next(err);
    }

    try {
      const checkUser = await userModel.findOne({ username });

      if (checkUser) {
        const err = createHttpError(302, "User Allready Exists!");
        return next(err);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const savedUser = await userModel.create({
        username: username,
        email: email,
        password: hashedPassword,
      });

      return res
        .status(201)
        .send({ message: `Successfully registered with ${savedUser.email}.` });
    } catch (error) {
      return next(error);
    }
  };

  logout = async (req, res, next) => {};

  forgotPassword = async (req, res, next) => {};

  // Helper functions
  tokenGenerator = async (req, res, next) => {};

  generateAccessToken = async (userId) => {
    try {
      return await jwt.sign(userId, ACCESS_TOKEN_SECRET, { expiresIn: "1hr" });
    } catch (error) {
      return next(error);
    }
  };

  generateRefreshToken = async (userId) => {
    try {
      return await jwt.sign(userId, this.REFRESH_TOKEN_SECRET, {
        expiresIn: "30d",
      });
    } catch (error) {
      return next(error);
    }
  };
}
