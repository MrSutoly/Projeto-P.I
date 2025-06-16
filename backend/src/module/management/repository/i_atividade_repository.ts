import { Atividade, Pergunta, Opcao } from '../../../shared/util/entities/atividade_type';

export interface IAtividadeRepository {
    // Atividades
    findAllAtividades(): Promise<Atividade[]>;
    findAtividadeById(id: number): Promise<Atividade | null>;
    findAtividadesByStatus(status: string): Promise<Atividade[]>;
    createAtividade(atividade: Atividade): Promise<Atividade>;
    updateAtividade(atividade: Atividade): Promise<Atividade>;
    deleteAtividade(id: number): Promise<void>;

    // Perguntas
    findPerguntasByAtividade(atividadeId: number): Promise<Pergunta[]>;
    createPergunta(pergunta: Pergunta): Promise<Pergunta>;
    updatePergunta(pergunta: Pergunta): Promise<Pergunta>;
    deletePergunta(id: number): Promise<void>;

    // Opções
    findOpcoesByPergunta(perguntaId: number): Promise<Opcao[]>;
    createOpcao(opcao: Opcao): Promise<Opcao>;
    updateOpcao(opcao: Opcao): Promise<Opcao>;
    deleteOpcao(id: number): Promise<void>;

    // Busca completa
    findAtividadeCompleta(id: number): Promise<Atividade & { perguntas: (Pergunta & { opcoes: Opcao[] })[] } | null>;
} 