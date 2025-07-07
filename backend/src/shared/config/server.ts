import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import '../../module/quizsession/container/container';
import '../../module/recycling/container/container';

import managementRouter from '../../module/management/http/routes/management_route';
import teachManagementRouter from '../../module/teachmanagement/http/routes/teach_route';
import quizSessionRouter from '../../module/quizsession/http/routes/quizsession_route';
import recyclingRouter from '../../module/recycling/http/routes/recycling_route';

const app: Application = express();

app.use(helmet());

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.use('/management', managementRouter);
app.use('/teach', teachManagementRouter);
app.use('/quiz', quizSessionRouter);
app.use('/recycling', recyclingRouter);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    console.error('Erro na aplicação');
    return response.status(500).json({
      error: 'Erro interno do servidor',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
    });
  }
);

export { app };
