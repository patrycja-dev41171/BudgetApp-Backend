import { Router } from "express";
import { ValidationError } from "../utils/error";
import { LoginRecord } from "../records/login.record";
import jwt from "jsonwebtoken";

export const refreshTokenRouter = Router().get("/", async (req, res) => {
  try {
    const refreshToken: string = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new ValidationError("Invalid refreshToken.");
    }

    const result = await LoginRecord.getOneByToken(refreshToken);
    if (!result) {
      throw new ValidationError("No login details in the database.");
    }

    jwt.verify(refreshToken, process.env.ACCESS_REFRESH_TOKEN_KEY, (err) => {
      if (err) {
        throw new ValidationError("Invalid refreshToken verification.");
      }

      const accessToken = jwt.sign(
        { id: result.id_user },
        process.env.ACCESS_TOKEN_KEY,
        { expiresIn: "10min" }
      );

      res.json({ accessToken: accessToken });
    });
  } catch (error) {
    console.log(error);
    throw new ValidationError("An error occurred while refreshing the token.");
  }
});
