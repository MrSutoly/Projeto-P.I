import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { ManagementUseCase } from '../../use-case/management_use_case';

interface RankingData {
  id: number;
  nome: string;
  pontos: number;
  posicao?: number;
}

@injectable()
export class RankingController {
  constructor(
    @inject(ManagementUseCase)
    private managementUseCase: ManagementUseCase
  ) {}

  async getRanking(req: Request, res: Response): Promise<Response> {
    try {
      // Buscar todas as turmas cadastradas
      const turmas = await this.managementUseCase.findAllClasses();
      
      // Processar o ranking das turmas
      const rankingData: RankingData[] = turmas.map((turma) => ({
        id: turma.id!,
        nome: turma.nome,
        pontos: turma.pontos || 0
      }));

      // Ordenar por pontos (maior para menor)
      const rankingOrdenado = rankingData
        .sort((a, b) => b.pontos - a.pontos)
        .map((turma, index) => ({
          ...turma,
          posicao: index + 1
        }));

      return res.json(rankingOrdenado);
    } catch (error) {
      console.error('Erro ao buscar ranking');
      return res.status(500).json({
        message: 'Erro interno ao buscar ranking'
      });
    }
  }
} 