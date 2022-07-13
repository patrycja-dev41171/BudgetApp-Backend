import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ValidationError } from "../error";
import { LoginRecord } from "../../records/login.record";

export const checkLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  const accessToken = authHeader && authHeader.split(" ")[1];
  const refreshToken: string = req.cookies.refreshToken;

  if (!accessToken || !refreshToken) {
    console.log("Użytkownik niezalogowany");
    const result = await LoginRecord.getOneByToken(refreshToken);
    if (result !== null) {
      console.log("usunięcie danych logowania z bazy");
      await LoginRecord.deleteOneByToken(refreshToken);
    }
    res.clearCookie("refreshToken");
    res.json({
      loggedIn: false,
    });
  } else {
    console.log("weryfikacja tokenu");
    await jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_KEY,
      (err, decoded) => {
        if (err) {
          throw new ValidationError("Nieprawidłowy token. Błąd w weryfikacji");
        }
        console.log("Użytkownik zalogowanyy i autoryzowny");
      }
    );
  }
  next();
};
