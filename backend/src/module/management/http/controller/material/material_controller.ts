import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { MaterialUseCase } from '../../../use-case/material_use_case';

@injectable()
export class MaterialController {
    constructor(
        @inject('MaterialUseCase')
        private materialUseCase: MaterialUseCase
    ) {}

    async getAllMaterials(req: Request, res: Response): Promise<void> {
        try {
            const materials = await this.materialUseCase.getAllMaterials();
            res.status(200).json(materials);
        } catch (error) {
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async getMaterialById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const material = await this.materialUseCase.getMaterialById(Number(id));
            
            if (!material) {
                res.status(404).json({ message: 'Material não encontrado' });
                return;
            }

            res.status(200).json(material);
        } catch (error) {
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async getMaterialsBySemana(req: Request, res: Response): Promise<void> {
        try {
            const { semana } = req.params;
            const materials = await this.materialUseCase.getMaterialsBySemana(Number(semana));
            res.status(200).json(materials);
        } catch (error) {
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async getMaterialsByTipo(req: Request, res: Response): Promise<void> {
        try {
            const { tipo } = req.params;
            const materials = await this.materialUseCase.getMaterialsByTipo(tipo);
            res.status(200).json(materials);
        } catch (error) {
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async createMaterial(req: Request, res: Response): Promise<void> {
        try {
            const { titulo, semana, topico, data, link, tipo } = req.body;

            if (!titulo || !semana || !topico || !data || !link || !tipo) {
                res.status(400).json({ message: 'Todos os campos são obrigatórios' });
                return;
            }

            const material = await this.materialUseCase.createMaterial({
                titulo,
                semana: Number(semana),
                topico,
                data,
                link,
                tipo
            });

            res.status(201).json(material);
        } catch (error) {
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async updateMaterial(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { titulo, semana, topico, data, link, tipo } = req.body;

            if (!titulo || !semana || !topico || !data || !link || !tipo) {
                res.status(400).json({ message: 'Todos os campos são obrigatórios' });
                return;
            }

            const material = await this.materialUseCase.updateMaterial(Number(id), {
                titulo,
                semana: Number(semana),
                topico,
                data,
                link,
                tipo
            });

            res.status(200).json(material);
        } catch (error: any) {
            if (error.message === 'Material não encontrado') {
                res.status(404).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async deleteMaterial(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await this.materialUseCase.deleteMaterial(Number(id));
            res.status(204).send();
        } catch (error: any) {
            if (error.message === 'Material não encontrado') {
                res.status(404).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
} 