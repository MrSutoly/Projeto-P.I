import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { IManagementRepository } from '../../management/repository/i_management_repository';

export const ensureAdmin = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    if (!req.user || typeof req.user.id !== 'number') {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const managementRepository = container.resolve<IManagementRepository>('ManagementRepository');
    const user = await managementRepository.findById(req.user.id);
    
    if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso permitido apenas para administradores' });
    }

    return next();
}; 