import { Router } from "express";
import { BalanceRecord } from "../records/balance.record";
import { HistoryRecord } from "../records/history.record";

export const balanceRouter = Router()
  .post("/check", async (req, res) => {
    const result = await BalanceRecord.getOneByUserId(req.body.id);

    if (!result) {
      res.json({
        isFirstTime: true,
      });
    } else {
      res.json({
        isFirstTime: false,
      });
    }
  })

  .post("/", async (req, res) => {
    const data = await new BalanceRecord(req.body);
    const date = new Date();

    await data.insertOne();

    await HistoryRecord.insertOne({
      user_id: req.body.user_id,
      date,
      type: "initial",
      amount: req.body.balance,
      name: req.body.name,
      category: "initial",
    });

    res.json({
      true: true,
    });
  })

  .get("/:id", async (req, res) => {
    const data = await BalanceRecord.getBalanceInfomation(req.params.id);
    res.json({
      data: data,
    });
  });
