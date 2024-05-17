import { errorHandler } from "./errror.js";
import jwt from "jsonwebtoken";

export const verifyuser = (req, res, next) => {
  const usertoken = req.cookies.access_token;
  console.log(usertoken);

  if (!usertoken) {
    return next(
      errorHandler(
        401,
        "You are unauthorized, please signin before trying again!"
      )
    );
  }
  jwt.verify(usertoken, "1047604112004230003204", (error, user) => {
    if (error) {
      return next(errorHandler(403, "Forbidden!"));
    }
    req.user = user;
    next();
  });
};
