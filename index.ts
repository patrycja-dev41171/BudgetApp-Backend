import express, { json } from "express";
import cors from "cors";
import "express-async-errors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import { config } from "./config/config";
import { handleError } from "./utils/error";

import { registrationRouter } from "./routers/registration.router";
import { loginRouter } from "./routers/login.router";
import { refreshTokenRouter } from "./routers/refreshToken.router";
import { currenciesRouter } from "./routers/currencies.router";
import { balanceRouter } from "./routers/balance.router";
import { addTransactionRouter } from "./routers/add-transaction.router";
import { transactionHistoryRouter } from "./routers/transaction-history.router";
import { nextTransactionsRouter } from "./routers/next-transactions.router";
import { userRouter } from "./routers/user.router";

const app = express();

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(json());

app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 500,
  })
);

app.use("/user", userRouter);
app.use("/next-transactions", nextTransactionsRouter);
app.use("/transaction-history", transactionHistoryRouter);
app.use("/add-transaction", addTransactionRouter);
app.use("/refreshToken", refreshTokenRouter);
app.use("/currencies", currenciesRouter);
app.use("/balance", balanceRouter);
app.use("/register", registrationRouter);
app.use("/login", loginRouter);
app.use(handleError);

app.listen(3001, "0.0.0.0", () => {
  console.log("Listening on port http://localhost:3001");
});
