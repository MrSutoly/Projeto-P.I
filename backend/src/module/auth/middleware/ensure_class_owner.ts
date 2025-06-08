import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { IManagementRepository } from '../../management/repository/i_management_repository';

export const ensureClassOwner = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    if (!req.user) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const { turma_id } = req.params;
    const managementRepository = container.resolve<IManagementRepository>('ManagementRepository');
    
    const turma = await managementRepository.findTurmaById(Number(turma_id));
    
    if (!turma) {
        return res.status(404).json({ message: 'Turma não encontrada' });
    }

    if (turma.professor_id !== req.user.id) {
        return res.status(403).json({ message: 'Acesso permitido apenas para o professor da turma' });
    }

    return next();
}; 