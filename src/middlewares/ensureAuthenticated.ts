import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export const ensureAuthenticated = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).json({
      message: "Token is missing!",
    });
  }

  // Bearer gdfjkbgjkgfdg8f788
  const [, token] = authToken.split(" ");

  try {
    verify(token, "1e5e51fa-05e3-4fa1-af5a-15cd1b1a3b4b");
    return next();
  } catch (err) {
    return response.status(401).json({
      message: "Token invalid!",
    });
  }
};
