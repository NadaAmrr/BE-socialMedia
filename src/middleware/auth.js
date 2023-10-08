import jwt from "jsonwebtoken";
import userModel from "../../DB/model/User.model.js";
import { asyncHandler } from "../utils/errorHandling.js";
import {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} from "http-status-codes";
//Authentication middleware to verfiy token and add data of (user) in request
export const auth = asyncHandler(async (req, res, next) => {
  // Get token from headers
  const { authorization } = req.headers;
  if (!authorization?.startsWith(process.env.BEARER_KEY)) {
    return next(
      new Error("authorization is required or in-valid BearerKey", {
        cause: 400,
      })
    );
  }
  const token = authorization.split(process.env.BEARER_KEY)[1];
  if (!token) {
    return next(new Error("Token is required", StatusCodes.UNAUTHORIZED));
  }
  // Verify token
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  // Find decoded ? and if it found without id
  if (!decoded?.id) {
    return next(new Error("In-valid token payload"));
  }
  //check if user is in DB?
  const user = await userModel.findById(decoded.id);
  if (!user) {
    return next(new Error("Not rejister account", StatusCodes.NOT_FOUND));
  }
  //Check expire sesion of user
  if (parseInt(user.updatedTime?.getTime()) / 1000 > decoded.iat) {
    return next(new Error("Token is Expired , please login again", StatusCodes.BAD_REQUEST));
  }
  //To take data of user to next middleware
  //Add property (user) to request
  req.user = user;
  req.time = decoded.iat;
  return next();
});
// ==================== isConfirmed&NotDeleted ===================
export const ConfirmedAndNotDeleted = async (req, res, next) => {
  if (req.user.isDeleted) {
    return next(
      new Error("This email is deleted Please login again", StatusCodes.UNAUTHORIZED)
    );
  }
  if (!req.user.confirmEmail) {
    return next(new Error("Confirm your email", StatusCodes.BAD_REQUEST));
  }
  req.user = req.user;
  return next();
};
