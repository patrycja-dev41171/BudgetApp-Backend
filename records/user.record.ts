import { User } from "../types";
import { ValidationError } from "../utils/error";
import { v4 as uuid } from "uuid";
import { pool } from "../utils/db.connection";
import { FieldPacket } from "mysql2";
import * as EmailValidator from "email-validator";
import { cipher } from "../utils/cipher";

type UserResults = [User[], FieldPacket[]];

export class UserRecord implements User {
  public id?: string;
  public name: string;
  public email: string;
  public password: string;
  public createdAt?: Date;

  constructor(obj: User) {
    if (!obj.name || obj.name.length < 5 || obj.name.length > 20) {
      throw new ValidationError(
        "Username should be between 5 and 20 characters."
      );
    }
    if (!obj.email || obj.email.length > 255) {
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

    this.id = obj.id ?? uuid();
    this.name = obj.name;
    this.email = obj.email.toLowerCase();
    this.password = obj.password;
    this.createdAt = new Date();
  }

  async insert(): Promise<void> {
    const hashPassword = cipher(this.password);
    await pool.execute(
      "INSERT INTO `user`(`id`, `name`, `email`,`password`, `createdAt`) VALUES(:id," +
        " :name,:email, :password, :createdAt)",
      {
        ...this,
        password: hashPassword,
      }
    );
  }

  static async getOne(email: string): Promise<User> {
    const [results] = (await pool.execute(
      "SELECT * FROM `user` WHERE `email` = :email",
      {
        email,
      }
    )) as UserResults;
    return results.length === 0 ? null : new UserRecord(results[0]);
  }

  static async getOneById(id: string): Promise<User> {
    const [results] = (await pool.execute(
      "SELECT * FROM `user` WHERE `id` = :id",
      {
        id,
      }
    )) as UserResults;
    return results.length === 0 ? null : new UserRecord(results[0]);
  }

  static async deleteOneById(id: string): Promise<void> {
    await pool.execute("DELETE  FROM `user` WHERE `id` = :id", {
      id,
    });
  }
}
