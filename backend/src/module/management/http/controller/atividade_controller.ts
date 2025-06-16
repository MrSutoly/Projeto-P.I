import { injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { Atividade, CreateAtividadeRequest } from '../../../../shared/util/entities/atividade_type';

@injectable()
export class AtividadeController {
  async getAllAtividades(req: Request, res: Response): Promise<Response> {
    try {
      const atividades: Atividade[] = [
        {
          id: 1,
          titulo: "Introdução ao Meio Ambiente",
          descricao: "Quiz sobre conceitos básicos",
          tipo: "quiz",
          ordem: 1,
          data: "2024-01-15",
          horario: "09:00",
          status: "concluida",
          pontos: 10
        },
        {
          id: 2,
          titulo: "Poluição do Ar",
          descricao: "Atividade sobre qualidade do ar",
          tipo: "quiz",
          ordem: 2,
          data: "2024-01-22",
          horario: "10:00",
          status: "disponivel",
          pontos: 15
        },
        {
          id: 3,
          titulo: "Recursos Hídricos",
          descricao: "Quiz sobre água e recursos hídricos",
          tipo: "quiz",
          ordem: 3,
          data: "2024-01-29",
          horario: "09:30",
          status: "disponivel",
          pontos: 20
        },
        {
          id: 4,
          titulo: "Biodiversidade",
          descricao: "Atividade sobre diversidade biológica",
          tipo: "quiz",
          ordem: 4,
          data: "2024-02-05",
          horario: "11:00",
          status: "bloqueada",
          pontos: 25
        },
        {
          id: 5,
          titulo: "Sustentabilidade",
          descricao: "Quiz sobre desenvolvimento sustentável",
          tipo: "quiz",
          ordem: 5,
          data: "2024-02-12",
          horario: "10:30",
          status: "bloqueada",
          pontos: 30
        },
        {
          id: 6,
          titulo: "Mudanças Climáticas",
          descricao: "Atividade sobre aquecimento global",
          tipo: "quiz",
          ordem: 6,
          data: "2024-02-19",
          horario: "09:00",
          status: "bloqueada",
          pontos: 35
        }
      ];

      const atividadesOrdenadas = atividades.sort((a, b) => a.ordem - b.ordem);

      return res.json(atividadesOrdenadas);
    } catch (error) {
      return res.status(500).json({
        message: 'Erro interno ao buscar atividades'
      });
    }
  }

  async getAtividadeById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const atividadeId = parseInt(id);

      if (atividadeId === 1) {
        const atividade: Atividade = {
          id: 1,
          titulo: "Introdução ao Meio Ambiente",
          descricao: "Quiz sobre conceitos básicos",
          tipo: "quiz",
          ordem: 1,
          data: "2024-01-15",
          horario: "09:00",
          status: "concluida",
          pontos: 10
        };
        return res.json(atividade);
      }

      return res.status(404).json({
        message: 'Atividade não encontrada'
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Erro interno ao buscar atividade'
      });
    }
  }

  async createAtividade(req: Request, res: Response): Promise<Response> {
    try {
      const atividadeData: CreateAtividadeRequest = req.body;

      if (!atividadeData.titulo || !atividadeData.descricao) {
        return res.status(400).json({
          message: 'Título e descrição são obrigatórios'
        });
      }

      const novaAtividade: Atividade = {
        id: Math.floor(Math.random() * 1000), // ID temporário
        titulo: atividadeData.titulo,
        descricao: atividadeData.descricao,
        tipo: atividadeData.tipo,
        ordem: atividadeData.ordem,
        data: atividadeData.data,
        horario: atividadeData.horario,
        status: 'bloqueada', // Nova atividade sempre começa bloqueada
        pontos: atividadeData.pontos
      };

      return res.status(201).json(novaAtividade);
    } catch (error) {
      return res.status(500).json({
        message: 'Erro interno ao criar atividade'
      });
    }
  }

  async updateAtividade(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const atividadeData: Partial<CreateAtividadeRequest> = req.body;

      const atividadeAtualizada: Atividade = {
        id: parseInt(id),
        titulo: atividadeData.titulo || 'Título atualizado',
        descricao: atividadeData.descricao || 'Descrição atualizada',
        tipo: atividadeData.tipo || 'quiz',
        ordem: atividadeData.ordem || 1,
        data: atividadeData.data || '2024-01-01',
        horario: atividadeData.horario || '09:00',
        status: 'disponivel',
        pontos: atividadeData.pontos || 10
      };

      return res.json(atividadeAtualizada);
    } catch (error) {
      return res.status(500).json({
        message: 'Erro interno ao atualizar atividade'
      });
    }
  }

  async deleteAtividade(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      return res.status(200).json({
        message: `Atividade ${id} removida com sucesso`
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Erro interno ao remover atividade'
      });
    }
  }
} 