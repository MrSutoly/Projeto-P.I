import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { ITeachRepository } from '../../repository/i_teach_repository';

@injectable()
export class ActivityController {
    constructor(
        @inject('TeachRepository')
        private teachRepository: ITeachRepository
    ) {}

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const activity = await this.teachRepository.createActivity(req.body);
            return res.status(201).json(activity);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const activities = await this.teachRepository.getAllActivities();
            return res.json(activities);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async getById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const activity = await this.teachRepository.getActivityById(Number(id));
            
            if (!activity) {
                return res.status(404).json({ message: 'Atividade não encontrada' });
            }

            return res.json(activity);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const activity = await this.teachRepository.updateActivity(Number(id), req.body);
            return res.json(activity);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            await this.teachRepository.deleteActivity(Number(id));
            return res.status(204).send();
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }
} 