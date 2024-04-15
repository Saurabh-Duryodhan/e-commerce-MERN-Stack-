import { getConfig } from "../../config/index.js";
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    message: err.message,
    errorStack: getConfig("NODE_ENV") === "producttion" ? "" : err.errorStack,
  });
};
