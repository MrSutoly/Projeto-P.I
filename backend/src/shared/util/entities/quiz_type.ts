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