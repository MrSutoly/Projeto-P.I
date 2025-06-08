export interface QuizSession {
    id?: number;
    quiz_id: number;
    professor_id: number;
    turma_id: number;
    status: 'aguardando' | 'em_andamento' | 'finalizado';
    pergunta_atual: number;
    data_inicio: Date;
    data_fim?: Date;
    codigo_acesso: string;
}

export interface QuizRespostaAluno {
    id?: number;
    sessao_id: number;
    aluno_id: number;
    pergunta_id: number;
    resposta_id: number;
    tempo_resposta: number;
}

export interface QuizAlunoConectado {
    id?: number;
    sessao_id: number;
    aluno_id: number;
    status: 'conectado' | 'desconectado';
    ultima_atividade: Date;
} 