import express, { Application } from "express";
import { Request, Response, NextFunction } from 'express';
import {reqLogger} from '../middlewares/logger';
import cors from "cors";
import helmet from "helmet";

const app: Application = express();

''
app.use(cors());
app.use(helmet());
app.use(express.json());
app.disable('x-powered-by');
app.use(reqLogger);

export { app };