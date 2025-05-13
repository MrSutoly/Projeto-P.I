import {Request, Response, NextFunction} from 'express';
import {LoggerService} from '../services/logger.service';

const loggerService = new LoggerService();

export const reqLogger = async (req: Request, res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString();
    const message = `[${timestamp}] ${req.method} ${req.url} IP: ${req.ip}`;

    console.log(message);

    await loggerService.saveLog(message);
    next();
};