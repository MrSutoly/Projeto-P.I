import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { JWTService } from '../services/jwt_service';

interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
    };
}

export const ensureAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const jwtService = container.resolve(JWTService);

        const decoded = await jwtService.verifyToken(token);

        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: 'Token inválido.' });
        }

        (req as AuthenticatedRequest).user = { id: Number(decoded.id) };

        return next();

    } catch (error) {
        return res.status(401).json({ message: 'Token inválido.' });
    }
}
