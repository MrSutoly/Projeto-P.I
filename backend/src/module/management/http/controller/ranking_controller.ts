import { injectable } from 'tsyringe';
import { Request, Response } from 'express';

interface RankingData {
  turma: string;
  pontos: number;
}

@injectable()
export class RankingController {
  async getRanking(req: Request, res: Response): Promise<Response> {
    try {
      // Por enquanto, dados mockados para demonstração
      // TODO: Implementar lógica real baseada em atividades concluídas e pontos
      const rankingData: RankingData[] = [
        { turma: "Turma A", pontos: 485.50 },
        { turma: "Turma B", pontos: 422.75 },
        { turma: "Turma C", pontos: 398.25 },
        { turma: "Turma D", pontos: 367.80 },
        { turma: "Turma E", pontos: 341.90 }
      ];

      // Ordenar por pontos (maior para menor)
      const rankingOrdenado = rankingData.sort((a, b) => b.pontos - a.pontos);

      return res.json(rankingOrdenado);
    } catch (error) {
      return res.status(500).json({
        message: 'Erro interno ao buscar ranking'
      });
    }
  }
} 