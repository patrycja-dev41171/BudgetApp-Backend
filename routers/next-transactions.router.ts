import { Router } from "express";
import { PermanentTransactionRecord } from "../records/pernament.transaction.record";
import { HistoryRecord } from "../records/history.record";

export const nextTransactionsRouter = Router()
  .get("/:id", async (req, res) => {
    const transactionsList = await PermanentTransactionRecord.listAll(
      req.params.id
    );
    res.json({
      transactionsList,
    });
  })
  .get("/income/:id", async (req, res) => {
    const nextIncome = await PermanentTransactionRecord.getNextIncome(
      req.params.id
    );

    if (nextIncome !== null) {
      function isAfter(date1: Date, date2: Date) {
        return date1 > date2;
      }

      const dateNow = new Date();
      const incomeDate = nextIncome.next_date;

      if (isAfter(dateNow, incomeDate)) {
        await PermanentTransactionRecord.updateOne(nextIncome.id);
        await HistoryRecord.insertOne({
          user_id: nextIncome.user_id,
          date: new Date(),
          type: nextIncome.type,
          amount: nextIncome.amount,
          name: nextIncome.name,
          category: nextIncome.category,
        });

        const newNextIncome = await PermanentTransactionRecord.getNextIncome(
          req.params.id
        );

        res.json({
          nextIncome: newNextIncome,
        });
      }

      res.json({
        nextIncome: nextIncome,
      });
    }
  })
  .get("/expense/:id", async (req, res) => {
    const nextExpense = await PermanentTransactionRecord.getNextExpense(
      req.params.id
    );

    if (nextExpense !== null) {
      function isAfter(date1: Date, date2: Date) {
        return date1 > date2;
      }

      const dateNow = new Date();
      const expenseDate = nextExpense.next_date;

      if (isAfter(dateNow, expenseDate)) {
        await PermanentTransactionRecord.updateOne(nextExpense.id);
        await HistoryRecord.insertOne({
          user_id: nextExpense.user_id,
          date: new Date(),
          type: nextExpense.type,
          amount: nextExpense.amount,
          name: nextExpense.name,
          category: nextExpense.category,
        });

        const newNextExpense = await PermanentTransactionRecord.getNextExpense(
          req.params.id
        );

        res.json({
          nextIncome: newNextExpense,
        });
      }

      res.json({
        nextExpense: nextExpense,
      });
    }
  });
