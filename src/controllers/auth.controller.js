import createHttpError from "http-errors";
import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getConfig } from "../../config/index.js";
import { request } from "express";
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

    const checkUser = await this.checkExistedUser(email);

    if (!checkUser) {
      const err = createHttpError(404, "User not found please register");
      return next(err);
    }

    const isPasswordMatch = bcrypt.compare(password, checkUser.password);

    if (isPasswordMatch) {
      const userId = { sub: checkUser._id.toString() };
      const tokens = await this.generateTokens(userId);
      const [access_token, refresh_token] = tokens;
      request.user = { userId: userId.sub, refresh_token };
      return res.status(200).json({ access_token });
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
      const checkUser = await this.checkExistedUser(email, username);

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

  checkExistedUser = async (email, username) => {
    try {
      if (email && username)
        return await userModel.findOne({ email, username }).exec();
      if (email) return await userModel.findOne({ email }).exec();
      if (username) return await userModel.findOne({ username }).exec();
    } catch (error) {
      return next(error);
    }
  };

  generateTokens = async (userId) => {
    try {
      return Promise.all(
        [this.generateAccessToken(userId), this.generateRefreshToken(userId)],
        (tokens) => {
          try {
            const [access_token, refresh_token] = tokens;
            return authTokens;
          } catch (error) {
            return next(error);
          }
        }
      );
    } catch (error) {
      return next(error);
    }
  };

  generateAccessToken = async (userId) => {
    const accessToken = await jwt.sign(userId, this.ACCESS_TOKEN_SECRET, {
      expiresIn: "1hr",
    });
    return accessToken;
  };

  generateRefreshToken = async (userId) => {
    const refreshToken = await jwt.sign(userId, this.REFRESH_TOKEN_SECRET, {
      expiresIn: "30d",
    });
    return refreshToken;
  };
}
