export interface Activity {
    id?: number;
    titulo: string;
    descricao: string;
    link_constante: string;
    semana_numero?: number;
}

export interface Week {
    numero: number;
    data_inicio: Date;
    data_fim: Date;
}

export interface Quiz {
    id?: number;
    titulo: string;
    tipo: 'kahoot' | 'clicar_objeto';
    atividade_id?: number;
}

export interface Question {
    id?: number;
    texto: string;
    quiz_id: number;
}

export interface Option {
    id?: number;
    texto: string;
    correta: boolean;
    pergunta_id: number;
} 