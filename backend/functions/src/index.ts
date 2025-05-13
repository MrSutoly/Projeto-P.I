import { app } from "./config/server";
import { Router, Request, Response } from 'express';
import  LoggerService  from './routes/logger_route';

const PORT = process.env.PORT || 3000;

app.get('/api/logs', LoggerService);

app.listen(PORT, () => {
  console.log(`ta rodando nessa porta aqui papai${PORT}`);
});