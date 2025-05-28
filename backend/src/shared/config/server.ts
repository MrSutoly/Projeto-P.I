import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";

const app: Application = express();

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 204
}));
app.use(helmet());
app.use(express.json());
app.disable('x-powered-by');

export { app };