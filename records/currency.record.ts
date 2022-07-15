import { pool } from "../utils/db.connection";
import { FieldPacket } from "mysql2";
import { Currency } from "../types";

type CurrencyRecordResults = [CurrencyRecord[], FieldPacket[]];

export class CurrencyRecord implements Currency {
  name: string;
  code: string;
  symbol: string;

  constructor(obj: Currency) {
    this.name = obj.name;
    this.code = obj.code;
    this.symbol = obj.symbol;
  }

  static async listAll(): Promise<CurrencyRecord[]> {
    const [results] = (await pool.execute(
      "SELECT * FROM `currencies`"
    )) as CurrencyRecordResults;
    return results.map((obj) => new CurrencyRecord(obj));
  }
}
