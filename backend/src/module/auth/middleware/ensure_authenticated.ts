import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { JWTService } from '../services/jwt_service';

export const ensureAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<Responde | void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    const jwtService = container.resolve(JWTService);

    try {
        const jwtService = container.resolve(JWTService);

        const decoded = await jwtService.verifyToken(token);

        req.user = { id: decoded.id };

        return next();

    } catch (error) {
        return res.status(401).json({ message: 'Token inválido.' });
    }
}
