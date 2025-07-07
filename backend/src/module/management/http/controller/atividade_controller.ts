import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { AtividadeUseCase } from '../../use-case/atividade_use_case';
import { Atividade, CreateAtividadeRequest } from '../../../../shared/util/entities/atividade_type';
import { AppError } from '../../../../shared/errors/AppError';

@injectable()
export class AtividadeController {
  constructor(
    @inject(AtividadeUseCase)
    private atividadeUseCase: AtividadeUseCase
  ) {}

  async getAllAtividades(req: Request, res: Response): Promise<Response> {
    try {
      const atividades = await this.atividadeUseCase.findAllAtividades();
      return res.json(atividades);
    } catch (error) {
      console.error('Erro ao buscar atividades');
      return res.status(500).json({
        message: 'Erro interno ao buscar atividades'
      });
    }
  }

  async getAtividadeById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({
          message: 'ID da atividade inválido'
        });
      }

      const atividade = await this.atividadeUseCase.findAtividadeById(Number(id));
      
      if (!atividade) {
        return res.status(404).json({
          message: 'Atividade não encontrada'
        });
      }

      return res.json(atividade);
    } catch (error) {
      console.error('Erro ao buscar atividade');
      return res.status(500).json({
        message: 'Erro interno ao buscar atividade'
      });
    }
  }

  async getAtividadeCompleta(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({
          message: 'ID da atividade inválido'
        });
      }

      const atividade = await this.atividadeUseCase.findAtividadeCompleta(Number(id));
      
      if (!atividade) {
        return res.status(404).json({
          message: 'Atividade não encontrada'
        });
      }

      return res.json(atividade);
    } catch (error) {
      console.error('Erro ao buscar atividade completa');
      return res.status(500).json({
        message: 'Erro interno ao buscar atividade completa'
      });
    }
  }

  async getAtividadesByStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { status } = req.query;

      if (!status) {
        return res.status(400).json({
          message: 'Status é obrigatório'
        });
      }

      const atividades = await this.atividadeUseCase.findAtividadesByStatus(status as string);
      return res.json(atividades);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          message: error.message
        });
      }
      console.error('Erro ao buscar atividades por status');
      return res.status(500).json({
        message: 'Erro interno ao buscar atividades'
      });
    }
  }

  async createAtividade(req: Request, res: Response): Promise<Response> {
    try {
      const atividadeData: CreateAtividadeRequest = req.body;

      const novaAtividade = await this.atividadeUseCase.createAtividade(atividadeData);
      
      return res.status(201).json(novaAtividade);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          message: error.message
        });
      }
      console.error('Erro ao criar atividade');
      return res.status(500).json({
        message: 'Erro interno ao criar atividade'
      });
    }
  }

  async updateAtividade(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const atividadeData = req.body;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({
          message: 'ID da atividade inválido'
        });
      }

      const atividadeAtualizada = await this.atividadeUseCase.updateAtividade(Number(id), atividadeData);
      
      return res.json(atividadeAtualizada);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          message: error.message
        });
      }
      console.error('Erro ao atualizar atividade');
      return res.status(500).json({
        message: 'Erro interno ao atualizar atividade'
      });
    }
  }

  async deleteAtividade(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({
          message: 'ID da atividade inválido'
        });
      }

      await this.atividadeUseCase.deleteAtividade(Number(id));
      
      return res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          message: error.message
        });
      }
      console.error('Erro ao deletar atividade');
      return res.status(500).json({
        message: 'Erro interno ao deletar atividade'
      });
    }
  }

  async liberarProximaAtividade(req: Request, res: Response): Promise<Response> {
    try {
      const atividade = await this.atividadeUseCase.liberarProximaAtividade();
      
      if (!atividade) {
        return res.status(404).json({
          message: 'Todas as atividades já foram liberadas'
        });
      }

      return res.json(atividade);
    } catch (error) {
      console.error('Erro ao liberar próxima atividade');
      return res.status(500).json({
        message: 'Erro interno ao liberar próxima atividade'
      });
    }
  }

  async marcarAtividadeComoConcluida(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({
          message: 'ID da atividade inválido'
        });
      }

      const atividade = await this.atividadeUseCase.marcarAtividadeComoConcluida(Number(id));
      
      return res.json(atividade);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          message: error.message
        });
      }
      console.error('Erro ao marcar atividade como concluída');
      return res.status(500).json({
        message: 'Erro interno ao marcar atividade como concluída'
      });
    }
  }
} 