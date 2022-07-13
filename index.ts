import express, { json } from "express";
import cors from "cors";
import "express-async-errors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import { config } from "./config/config";
import { handleError } from "./utils/error";
import { registerRouter } from "./routers/register.router";
import { loginRouter } from "./routers/login.router";
import { refreshTokenRouter } from "./routers/refreshToken.router";
import {currenciesRouter} from "./routers/currencies.router";
import {amountRouter} from "./routers/amount.router";

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
    windowMs: 5 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  })
);

app.use("/refreshToken", refreshTokenRouter);
app.use("/currencies", currenciesRouter);
app.use("/amount", amountRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use(handleError);

app.listen(3001, "0.0.0.0", () => {
  console.log("Listening on port http://localhost:3001");
});
