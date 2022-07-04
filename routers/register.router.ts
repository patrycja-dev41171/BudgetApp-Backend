import { Router } from "express";
import { UserRecord } from "../records/user.record";
import { hash } from "bcrypt";
import { ValidationError } from "../utils/error";

export const registerRouter = Router().post("/", async (req, res) => {
  const { email, password } = req.body;
  email.toLowerCase();
  const result = await UserRecord.getOne(email);

  if (result !== null) {
    throw new ValidationError(
      "An account with such an e-mail has already been created. Enter a new e-mail address or log in."
    );
  } else {
    hash(password, 10, async (err: Error, password: string) => {
      if (err) {
        console.log(err);
      } else {
        const user = new UserRecord({
          ...req.body,
          password,
        });
        await user.insert();
        res.json(user.id);
      }
    });
  }
});
