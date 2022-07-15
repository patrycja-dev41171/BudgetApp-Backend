import { Router } from "express";
import { CategoryRecord } from "../records/category.record";
import { HistoryRecord } from "../records/history.record";
import { BalanceRecord } from "../records/balance.record";
import { PermanentTransactionRecord } from "../records/pernament.transaction.record";

export const addTransactionRouter = Router()
  .get("/", async (req, res) => {
    const categoryList = await CategoryRecord.listAll();
    res.json({
      categoryList,
    });
  })

  .post("/", async (req, res) => {
    const { user_id, type, amount, name, category, is_disposable } = req.body;

    const data = await BalanceRecord.getOneByUserId(user_id);

    const newBalance =
      type === "expense"
        ? Number(data.balance) - Number(amount)
        : Number(data.balance) + Number(amount);
    await BalanceRecord.updateBalance(user_id, newBalance);

    if (!is_disposable) {
      const date = new Date();
      const transaction = await new PermanentTransactionRecord({
        user_id,
        date: new Date(),
        next_date: new Date(date.setMonth(date.getMonth() + 1)),
        type,
        amount,
        name,
        category,
      });
      await transaction.insert();
    }

    await HistoryRecord.insertOne({
      user_id,
      date: new Date(),
      type,
      amount,
      name,
      category,
    });

    res.json({
      true: true,
    });
  });
