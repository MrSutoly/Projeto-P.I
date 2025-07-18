/// <reference path="../../../@types/express/index.d.ts" />
import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { IManagementRepository } from '../../management/repository/i_management_repository';

interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
    };
}

export const ensureTeacher = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const authenticatedReq = req as AuthenticatedRequest;
    
    if (!authenticatedReq.user || typeof authenticatedReq.user.id !== 'number') {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const managementRepository = container.resolve<IManagementRepository>('ManagementRepository');
    const user = await managementRepository.findById(authenticatedReq.user.id);
    
    if (!user || user.role !== 'professor') {
        return res.status(403).json({ message: 'Acesso permitido apenas para professores' });
    }

    return next();
}; 