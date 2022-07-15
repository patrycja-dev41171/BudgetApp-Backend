import { Router } from "express";
import { UserRecord } from "../records/user.record";
import { ValidationError } from "../utils/error";
import { LoginRecord } from "../records/login.record";
import { BalanceRecord } from "../records/balance.record";
import { HistoryRecord } from "../records/history.record";
import { PermanentTransactionRecord } from "../records/pernament.transaction.record";

export const userRouter = Router()
  .get("/:id", async (req, res) => {
    const user = await UserRecord.getOneById(req.params.id);

    res.json({
      user: user,
    });
  })

  .delete("/delete-data/:id", async (req, res) => {
    const id = req.params.id;

    if (id) {
      try {
        await LoginRecord.deleteOneById(id);
        await BalanceRecord.deleteOneById(id);
        await HistoryRecord.deleteOneById(id);
        await PermanentTransactionRecord.deleteOneById(id);
        res.clearCookie("refreshToken");
        res.json({
          data_deleted: true,
        });
      } catch (err) {
        throw new ValidationError(err);
      }
    }
  })

  .delete("/delete-account/:id", async (req, res) => {
    const id = req.params.id;

    if (id) {
      try {
        await LoginRecord.deleteOneById(id);
        await BalanceRecord.deleteOneById(id);
        await HistoryRecord.deleteOneById(id);
        await PermanentTransactionRecord.deleteOneById(id);
        await UserRecord.deleteOneById(id);
        res.clearCookie("refreshToken");
        res.json({
          account_deleted: true,
        });
      } catch (err) {
        throw new ValidationError(err);
      }
    }
  });
