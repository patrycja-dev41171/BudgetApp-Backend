import { Router } from "express";
import { UserRecord } from "../records/user.record";
import { ValidationError } from "../utils/error";

export const registrationRouter = Router().post("/", async (req, res) => {
  const { email } = req.body;
  const result = await UserRecord.getOne(email.toLowerCase());

  if (result !== null) {
    throw new ValidationError(
      "An account with such an e-mail has already been created. Enter a new e-mail address or log in."
    );
  } else {
    const user = new UserRecord(req.body);
    await user.insert();
    res.json(user.id);
  }
});
