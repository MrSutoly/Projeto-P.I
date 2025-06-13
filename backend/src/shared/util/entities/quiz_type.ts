export type QuizType = 'kahoot' | 'clicar_objeto';

export type Option = {
    id?: number;
    texto: string;
    correta: boolean;
    pergunta_id: number;
}

export type Question = {
    id?: number;
    texto: string;
    quiz_id: number;
    opcoes?: Option[];
}

export type Quiz = {
    id?: number;
    titulo: string;
    tipo: QuizType;
    pontos: number;
    atividade_id?: number;
    perguntas?: Question[];
}

export type QuizResponse = {
    id?: number;
    usuario_id: number;  
    quiz_id: number;
    pergunta_id: number;
    opcao_id: number;
    timestamp?: Date;
}

export type QuizResult = {
    total_perguntas: number;      
    respostas_corretas: number;   
    pontuacao: number;
    completude: boolean;
}

export interface QuizSession {
    id: number;
    quiz_id: number;
    professor_id: number;
    turma_id: number;
    status: 'aguardando' | 'em_andamento' | 'finalizado';
    pergunta_atual: number;
    codigo_acesso: string;
    criado_em: Date;
}

export interface AlunoResposta {
    id: number;
    sessao_id: number;
    aluno_id: number;
    pergunta_id: number;
    resposta_id: number;
    tempo_resposta: number;
    respondido_em: Date;
}

export interface Pontuacao {
    pontos: number;
    aluno_id: number;
    sessao_id: number;
    turma_id: number;
}