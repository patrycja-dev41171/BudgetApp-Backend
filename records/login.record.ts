import "dotenv/config";
import { Login, LoginStored, User } from "../types";
import { ValidationError } from "../utils/error";
import * as EmailValidator from "email-validator";
import { UserRecord } from "./user.record";
import { comparePassword } from "../utils/comparePassword";
import jwt from "jsonwebtoken";
import { LoginCreated } from "../types";
import { pool } from "../utils/db.connection";
import { v4 as uuid } from "uuid";
import { FieldPacket } from "mysql2";

type LoginResults = [LoginStored[], FieldPacket[]];

export class LoginRecord implements Login {
  email: string;
  password: string;

  constructor(obj: Login) {
    if (!obj.email) {
      throw new ValidationError("E-mail cannot be empty.");
    }
    const result = EmailValidator.validate(obj.email);
    if (!result) {
      throw new ValidationError("Invalid e-mail.");
    }
    if (!obj.password || obj.password.length < 5 || obj.password.length > 255) {
      throw new ValidationError(
        "The password should be longer than 5 characters."
      );
    }

    this.email = obj.email.toLowerCase();
    this.password = obj.password;
  }

  async auth(): Promise<User> {
    const user = await UserRecord.getOne(this.email);
    if (!user) {
      throw new ValidationError(
        "Invalid e-mail or password. The user with the given data does" +
          " not exist."
      );
    }
    const isCorrect = comparePassword(this.password, user.password);
    if (!isCorrect) {
      throw new ValidationError(
        "Invalid e-mail or password. The user with the given data does" +
          " not exist."
      );
    }
    return user;
  }

  createTokens(payload: string): LoginCreated {
    const token = jwt.sign({ id: payload }, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: "10min",
    });
    const refreshToken = jwt.sign(
      { id: payload },
      process.env.ACCESS_REFRESH_TOKEN_KEY,
      { expiresIn: "24h" }
    );
    return {
      id: payload,
      token,
      refreshToken,
    };
  }

  async insert(authData: LoginCreated) {
    await pool.execute(
      "INSERT INTO `user_auth_token`(`id`, `user_id`, `refresh_token`,`createdAt`)VALUES(:id,:user_id,:refresh_token, :createdAt)",
      {
        id: uuid(),
        user_id: authData.id,
        refresh_token: authData.refreshToken,
        createdAt: new Date(),
      }
    );
  }

  static async getOneByToken(refreshToken: string): Promise<LoginStored> {
    const [results] = (await pool.execute(
      "SELECT * FROM `user_auth_token` WHERE `refresh_token` = :refreshToken",
      {
        refreshToken,
      }
    )) as LoginResults;
    return results.length === 0 ? null : results[0];
  }

  static async deleteOneByToken(refreshToken: string): Promise<void> {
    await pool.execute(
      "DELETE FROM `user_auth_token` WHERE `refresh_token` = :refreshToken",
      {
        refreshToken,
      }
    );
  }
}
