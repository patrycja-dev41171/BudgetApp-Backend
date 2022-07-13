import { Router } from "express";
import { CurrencyRecord } from "../records/currency.record";

export const currenciesRouter = Router().get("/", async (req, res) => {
  const currenciesList = await CurrencyRecord.listAll();
  res.json({
    currenciesList,
  });
});
