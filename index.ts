import express, { json } from "express";
import cors from "cors";
import "express-async-errors";
import rateLimit from "express-rate-limit";
import { config } from "./config/config";
import { handleError } from "./utils/error";
import { registerRouter } from "./routers/register.router";

const app = express();

app.use(
  cors({
    origin: config.corsOrigin,
  })
);

app.use(json());

app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  })
);

app.use("/register", registerRouter);

app.use(handleError);

app.listen(3001, "0.0.0.0", () => {
  console.log("Listening on port http://localhost:3001");
});
