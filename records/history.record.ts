import { HistoryEntity } from "../types";
import { pool } from "../utils/db.connection";
import { v4 as uuid } from "uuid";
import { FieldPacket } from "mysql2";

export type HistoryRecordResults = [HistoryRecord[], FieldPacket[]];

export class HistoryRecord implements HistoryEntity {
  id: string;
  user_id: string;
  date: Date;
  type: "initial" | "income" | "expense" | "change";
  amount: number;
  name: string;
  category?: string;

  constructor(obj: HistoryEntity) {
    this.id = obj.id ?? uuid();
    this.user_id = obj.user_id;
    this.date = obj.date;
    this.type = obj.type;
    this.amount = obj.amount;
    this.name = obj.name;
    this.category = obj.category;
  }

  static async insertOne(obj: HistoryEntity): Promise<void> {
    const newId = uuid();
    await pool.execute(
      "INSERT INTO `user_history`(`id`, `user_id`, `date`, `type`,`amount`,`name`,`category`)VALUES(:id,:user_id,:date,:type,:amount,:name, :category)",
      {
        id: newId,
        user_id: obj.user_id,
        date: obj.date,
        type: obj.type,
        amount: obj.amount,
        name: obj.name,
        category: obj.category,
      }
    );
  }

  static async listAll(user_id: string): Promise<HistoryRecord[]> {
    const [results] = (await pool.execute(
      "SELECT * FROM `user_history` WHERE `user_id` = :user_id ORDER BY `date` DESC ",
      {
        user_id,
      }
    )) as HistoryRecordResults;
    return results.map((obj) => new HistoryRecord(obj));
  }

  static async deleteOneById(id: string): Promise<void> {
    await pool.execute("DELETE FROM `user_history` WHERE `user_id` = :id", {
      id,
    });
  }
}
