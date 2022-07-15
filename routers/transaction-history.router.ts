import { Router } from "express";
import { HistoryRecord } from "../records/history.record";

export const transactionHistoryRouter = Router().get(
  "/:id",
  async (req, res) => {
    const historyList = await HistoryRecord.listAll(req.params.id);
    res.json({
      historyList,
    });
  }
);
