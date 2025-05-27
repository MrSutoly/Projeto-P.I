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