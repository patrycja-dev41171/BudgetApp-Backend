import { Router } from "express";
import { ValidationError } from "../utils/error";
import { LoginRecord } from "../records/login.record";

export const loginRouter = Router().post("/", async (req, res) => {

  const loginRecord = new LoginRecord(req.body);

  const user = await loginRecord.auth();
  if (!user) {
    throw new ValidationError("Invalid authentication.");
  }

  if (req.cookies.refreshToken !== undefined) {
    const isLoggedIn = await LoginRecord.getOneByToken(
      req.cookies.refreshToken
    );
    if (isLoggedIn !== null) {
      throw new ValidationError("User is already logged in.");
    }
  }

  const response = await loginRecord.createTokens(user.id);
  await loginRecord.insert(response);

  res
    .cookie("refreshToken", response.refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    })
    .json({
      id: response.id,
      name: user.name,
      accessToken: response.token,
      loggedIn: true,
    });
});
