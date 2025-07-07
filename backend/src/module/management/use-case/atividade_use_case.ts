import { injectable, inject } from 'tsyringe';
import { IAtividadeRepository } from '../repository/i_atividade_repository';
import { Atividade, Pergunta, Opcao, CreateAtividadeRequest, CreatePerguntaRequest, CreateOpcaoRequest } from '../../../shared/util/entities/atividade_type';
import { AppError } from '../../../shared/errors/AppError';

@injectable()
export class AtividadeUseCase {
    constructor(
        @inject('AtividadeRepository')
        private atividadeRepository: IAtividadeRepository
    ) {}

    async findAllAtividades(): Promise<Atividade[]> {
        return await this.atividadeRepository.findAllAtividades();
    }

    async findAtividadeById(id: number): Promise<Atividade | null> {
        if (!id) {
            throw new AppError('ID da atividade é obrigatório', 400);
        }

        return await this.atividadeRepository.findAtividadeById(id);
    }

    async findAtividadesByStatus(status: string): Promise<Atividade[]> {
        const validStatuses = ['bloqueada', 'disponivel', 'concluida'];
        if (!validStatuses.includes(status)) {
            throw new AppError('Status inválido', 400);
        }

        return await this.atividadeRepository.findAtividadesByStatus(status);
    }

    async createAtividade(atividadeData: CreateAtividadeRequest): Promise<Atividade> {
        // Validações básicas
        if (!atividadeData.titulo || atividadeData.titulo.trim() === '') {
            throw new AppError('Título é obrigatório', 400);
        }

        if (!atividadeData.descricao || atividadeData.descricao.trim() === '') {
            throw new AppError('Descrição é obrigatória', 400);
        }

        if (!atividadeData.tipo || !['quiz', 'texto', 'imagem'].includes(atividadeData.tipo)) {
            throw new AppError('Tipo deve ser: quiz, texto ou imagem', 400);
        }

        if (!atividadeData.data) {
            throw new AppError('Data é obrigatória', 400);
        }

        if (!atividadeData.horario) {
            throw new AppError('Horário é obrigatório', 400);
        }

        if (atividadeData.pontos < 0) {
            throw new AppError('Pontos não podem ser negativos', 400);
        }

        // Criar a atividade
        const novaAtividade: Atividade = {
            titulo: atividadeData.titulo,
            descricao: atividadeData.descricao,
            tipo: atividadeData.tipo,
            ordem: atividadeData.ordem,
            data: atividadeData.data,
            horario: atividadeData.horario,
            status: 'bloqueada', // Novas atividades sempre começam bloqueadas
            pontos: atividadeData.pontos || 0
        };

        const atividadeCriada = await this.atividadeRepository.createAtividade(novaAtividade);

        // Se há perguntas, criá-las
        if (atividadeData.perguntas && atividadeData.perguntas.length > 0) {
            for (const perguntaData of atividadeData.perguntas) {
                const pergunta: Pergunta = {
                    atividade_id: atividadeCriada.id!,
                    texto: perguntaData.texto,
                    tipo: perguntaData.tipo,
                    ordem: perguntaData.ordem
                };

                const perguntaCriada = await this.atividadeRepository.createPergunta(pergunta);

                // Se há opções, criá-las
                if (perguntaData.opcoes && perguntaData.opcoes.length > 0) {
                    for (const opcaoData of perguntaData.opcoes) {
                        const opcao: Opcao = {
                            pergunta_id: perguntaCriada.id!,
                            texto: opcaoData.texto,
                            correta: opcaoData.correta,
                            ordem: opcaoData.ordem
                        };

                        await this.atividadeRepository.createOpcao(opcao);
                    }
                }
            }
        }

        return atividadeCriada;
    }

    async updateAtividade(id: number, atividadeData: Partial<Atividade>): Promise<Atividade> {
        const atividadeExistente = await this.atividadeRepository.findAtividadeById(id);
        if (!atividadeExistente) {
            throw new AppError('Atividade não encontrada', 404);
        }

        // Validações
        if (atividadeData.titulo && atividadeData.titulo.trim() === '') {
            throw new AppError('Título não pode ser vazio', 400);
        }

        if (atividadeData.descricao && atividadeData.descricao.trim() === '') {
            throw new AppError('Descrição não pode ser vazia', 400);
        }

        if (atividadeData.tipo && !['quiz', 'texto', 'imagem'].includes(atividadeData.tipo)) {
            throw new AppError('Tipo deve ser: quiz, texto ou imagem', 400);
        }

        if (atividadeData.status && !['bloqueada', 'disponivel', 'concluida'].includes(atividadeData.status)) {
            throw new AppError('Status deve ser: bloqueada, disponivel ou concluida', 400);
        }

        if (atividadeData.pontos !== undefined && atividadeData.pontos < 0) {
            throw new AppError('Pontos não podem ser negativos', 400);
        }

        const atividadeAtualizada = { ...atividadeExistente, ...atividadeData, id };
        return await this.atividadeRepository.updateAtividade(atividadeAtualizada);
    }

    async deleteAtividade(id: number): Promise<void> {
        const atividadeExistente = await this.atividadeRepository.findAtividadeById(id);
        if (!atividadeExistente) {
            throw new AppError('Atividade não encontrada', 404);
        }

        await this.atividadeRepository.deleteAtividade(id);
    }

    async findAtividadeCompleta(id: number): Promise<Atividade & { perguntas: (Pergunta & { opcoes: Opcao[] })[] } | null> {
        if (!id) {
            throw new AppError('ID da atividade é obrigatório', 400);
        }

        return await this.atividadeRepository.findAtividadeCompleta(id);
    }

    async liberarProximaAtividade(): Promise<Atividade | null> {
        // Buscar a próxima atividade bloqueada (por ordem)
        const todasAtividades = await this.atividadeRepository.findAllAtividades();
        
        // Ordenar por ordem
        const atividadesOrdenadas = todasAtividades.sort((a, b) => a.ordem - b.ordem);
        
        // Encontrar a primeira atividade bloqueada
        const proximaAtividade = atividadesOrdenadas.find(a => a.status === 'bloqueada');
        
        if (!proximaAtividade) {
            return null; // Todas as atividades já foram liberadas
        }

        // Liberar a atividade
        return await this.updateAtividade(proximaAtividade.id!, { status: 'disponivel' });
    }

    async marcarAtividadeComoConcluida(id: number): Promise<Atividade> {
        const atividade = await this.atividadeRepository.findAtividadeById(id);
        if (!atividade) {
            throw new AppError('Atividade não encontrada', 404);
        }

        if (atividade.status !== 'disponivel') {
            throw new AppError('Atividade deve estar disponível para ser concluída', 400);
        }

        return await this.updateAtividade(id, { status: 'concluida' });
    }
} 