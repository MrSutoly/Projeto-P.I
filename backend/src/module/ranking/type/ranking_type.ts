export type TurmaRanking = {
    id: number;
    nome: string;
    media_geral: number;
    total_quizzes: number;
    melhor_aluno?: {
        nome: string;
        pontuacao: number;
    };
    posicao?: number;
};

export type AlunoRanking = {
    id: number;
    nome: string;
    turma_id: number;
    turma_nome: string;
    pontuacao_total: number;
    quizzes_realizados: number;
    media: number;
    posicao?: number;
};