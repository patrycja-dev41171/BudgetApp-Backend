import { pool } from "../utils/db.connection";
import { FieldPacket } from "mysql2";
import { Category } from "../types";
import { v4 as uuid } from "uuid";

type CategoryRecordResults = [CategoryRecord[], FieldPacket[]];

export class CategoryRecord implements Category {
  id: string;
  name: string;

  constructor(obj: Category) {
    this.id = obj.id ?? uuid();
    this.name = obj.name;
  }

  static async listAll(): Promise<CategoryRecord[]> {
    const [results] = (await pool.execute(
      "SELECT * FROM `categories`"
    )) as CategoryRecordResults;
    return results.map((obj) => new CategoryRecord(obj));
  }
}
