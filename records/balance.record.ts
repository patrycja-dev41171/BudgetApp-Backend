import { Balance, BalanceData } from "../types";
import { pool } from "../utils/db.connection";
import { v4 as uuid } from "uuid";
import { FieldPacket } from "mysql2";
import { HistoryRecord, HistoryRecordResults } from "./history.record";

type BalanceRecordResults = [BalanceRecord[], FieldPacket[]];

export class BalanceRecord implements Balance {
  id?: string;
  user_id: string;
  balance: number;
  currency: string;
  name: string;
  date?: Date;

  constructor(obj: Balance) {
    this.id = obj.id ?? uuid();
    this.user_id = obj.user_id;
    this.balance = obj.balance;
    this.currency = obj.currency;
    this.name = obj.name;
    this.date = new Date();
  }

  async insertOne(): Promise<void> {
    await pool.execute(
      "INSERT INTO `user_balance`" +
        " (`id`,`user_id`,`balance`,`currency`,`name`,`date`)VALUES(:id,:user_id,:balance,:currency,:name,:date)",
      {
        ...this,
      }
    );
  }

  static async getOneByUserId(id: string) {
    const [results] = (await pool.execute(
      "SELECT * FROM `user_balance` WHERE `user_id` = :user_id",
      {
        user_id: id,
      }
    )) as BalanceRecordResults;
    return results.length === 0 ? null : new BalanceRecord(results[0]);
  }

  static async getBalanceInfomation(id: string) {
    const month = new Date().getMonth() + 1;
    const data = await BalanceRecord.getOneByUserId(id);
    const balance = data.balance;
    const [resultsExpenses] = (await pool.execute(
      "SELECT * FROM `user_history` WHERE `user_id` = :user_id AND `type` = :type AND" +
        " MONTH(date)=:month",
      {
        user_id: id,
        type: "expense",
        month: month,
      }
    )) as HistoryRecordResults;
    const expensesArr = resultsExpenses.map((obj) => {
      return new HistoryRecord(obj);
    });
    const expenses = expensesArr.reduce((prev, cur) => {
      return prev + cur.amount;
    }, 0);

    const [resultsIncome] = (await pool.execute(
      "SELECT * FROM `user_history` WHERE `user_id` = :user_id AND `type` = :type AND" +
        " MONTH(date)=:month",
      {
        user_id: id,
        type: "income",
        month: month,
      }
    )) as HistoryRecordResults;
    const incomeArr = resultsIncome.map((obj) => {
      return new HistoryRecord(obj);
    });
    const income = incomeArr.reduce((prev, cur) => {
      return prev + cur.amount;
    }, 0);
    return {
      currency: data.currency,
      balance,
      expenses,
      income,
    } as BalanceData;
  }

  static async updateBalance(id: string, newBalance: number) {
    await pool.execute(
      "UPDATE `user_balance` SET `balance` = :newBalance WHERE `user_id` = :id",
      {
        newBalance: newBalance,
        id: id,
      }
    );
  }

  static async deleteOneById(id: string): Promise<void> {
    await pool.execute("DELETE FROM `user_balance` WHERE `user_id` = :id", {
      id,
    });
  }
}
