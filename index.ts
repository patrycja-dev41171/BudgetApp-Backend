import express, {json} from "express";
import cors from 'cors';
import 'express-async-errors';
import rateLimit from 'express-rate-limit'
import {config} from "./config/config";

const app = express();

app.use(cors({
    origin: config.corsOrigin,
}));

app.use(json());

app.use(rateLimit({
    windowMs: 5 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
}));

app.get('/', (req, res) => {
    res.send('<h1>It works!</h1>')
})


app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on port http://localhost:3001');
});