import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";

import '../../module/quizsession/container/container';
import '../../module/recycling/container/container';
// Import other containers if they follow the same pattern

import managementRouter from '../../module/management/http/routes/management_route';
import teachManagementRouter from '../../module/teachmanagement/http/routes/teach_route';
import quizSessionRouter from '../../module/quizsession/http/routes/quizsession_route';
import recyclingRouter from '../../module/recycling/http/routes/recycling_route';
import { Request, Response, NextFunction } from "express";

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

app.use('/management', managementRouter);
app.use('/teach', teachManagementRouter);
app.use('/quiz', quizSessionRouter);
app.use('/recycling', recyclingRouter);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    // ... existing code ...
  }
);

export { app };