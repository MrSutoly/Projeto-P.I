import { Router } from 'express';
import { LoggerService } from '../services/logger.service';

const router = Router();
const loggerService = new LoggerService();

    router.get('/', async (req, res) => {
        try{
            const date = req.query.date as string;
            const logs = await loggerService.getLogs(date);
            res.json(logs);
        }catch (error) {
            res.status(500).json({ error: 'Erro ao buscar Logs'})
        }
    });

export default router;