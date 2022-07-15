import { pool } from "../utils/db.connection";
import { FieldPacket } from "mysql2";
import { v4 as uuid } from "uuid";
import { PermanentTransaction } from "../types";

type PermanentTransactionResults = [PermanentTransaction[], FieldPacket[]];

export class PermanentTransactionRecord implements PermanentTransaction {
  id?: string;
  user_id: string;
  date: Date;
  next_date: Date;
  type: "initial" | "income" | "expense" | "change";
  amount: number;
  name: string;
  category: string;

  constructor(obj: PermanentTransaction) {
    this.id = obj.id ?? uuid();
    this.user_id = obj.user_id;
    this.date = obj.date;
    this.next_date = obj.next_date;
    this.type = obj.type;
    this.amount = obj.amount;
    this.name = obj.name;
    this.category = obj.category;
  }

  async insert(): Promise<void> {
    await pool.execute(
      "INSERT INTO" +
        " `user_pernament_transactions`(`id`,`user_id`,`date`,`next_date`,`type`,`amount`," +
        " `name`, `category`)VALUES(:id,:user_id,:date,:next_date,:type,:amount,:name,:category)",
      {
        ...this,
      }
    );
  }

  static async getNextExpense(user_id: string) {
    const [results] = (await pool.execute(
      "SELECT * FROM `user_pernament_transactions` WHERE `user_id` = :user_id AND `type` =" +
        " :type ORDER BY `next_date` ASC",
      {
        user_id,
        type: "expense",
      }
    )) as PermanentTransactionResults;
    return results.length === 0
      ? null
      : new PermanentTransactionRecord(results[0]);
  }

  static async getNextIncome(user_id: string) {
    const [results] = (await pool.execute(
      "SELECT * FROM `user_pernament_transactions` WHERE `user_id` = :user_id AND `type` =" +
        " :type ORDER BY `next_date` ASC",
      {
        user_id: user_id,
        type: "income",
      }
    )) as PermanentTransactionResults;
    return results.length === 0
      ? null
      : new PermanentTransactionRecord(results[0]);
  }

  static async updateOne(id: string) {
    const date = new Date();
    await pool.execute(
      "UPDATE `user_pernament_transactions` SET `next_date` = :next_date WHERE `id` = :id",
      {
        id: id,
        next_date: new Date(date.setMonth(date.getMonth() + 1)),
      }
    );
  }

  static async listAll(user_id: string): Promise<PermanentTransactionRecord[]> {
    const [results] = (await pool.execute(
      "SELECT * FROM `user_pernament_transactions` WHERE `user_id` = :user_id ORDER BY" +
        " `next_date` ASC ",
      {
        user_id,
      }
    )) as PermanentTransactionResults;
    return results.map((obj) => new PermanentTransactionRecord(obj));
  }

  static async deleteOneById(id: string): Promise<void> {
    await pool.execute(
      "DELETE FROM `user_pernament_transactions` WHERE `user_id` = :id",
      {
        id,
      }
    );
  }
}
