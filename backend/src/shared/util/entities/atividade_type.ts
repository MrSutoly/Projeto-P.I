export type Atividade = {
    id?: number;
    titulo: string;
    descricao: string;
    tipo: 'quiz' | 'texto' | 'imagem';
    ordem: number;
    data: string;
    horario: string;
    status: 'bloqueada' | 'disponivel' | 'concluida';
    pontos: number;
    created_at?: string;
    updated_at?: string;
}

export type Pergunta = {
    id?: number;
    atividade_id: number;
    texto: string;
    tipo: 'multipla_escolha' | 'verdadeiro_falso' | 'dissertativa';
    ordem: number;
    created_at?: string;
    updated_at?: string;
}

export type Opcao = {
    id?: number;
    pergunta_id: number;
    texto: string;
    correta: boolean;
    ordem: number;
    created_at?: string;
    updated_at?: string;
}

export type CreateAtividadeRequest = {
    titulo: string;
    descricao: string;
    tipo: 'quiz' | 'texto' | 'imagem';
    ordem: number;
    data: string;
    horario: string;
    pontos: number;
    perguntas?: CreatePerguntaRequest[];
}

export type CreatePerguntaRequest = {
    texto: string;
    tipo: 'multipla_escolha' | 'verdadeiro_falso' | 'dissertativa';
    ordem: number;
    opcoes?: CreateOpcaoRequest[];
}

export type CreateOpcaoRequest = {
    texto: string;
    correta: boolean;
    ordem: number;
} 