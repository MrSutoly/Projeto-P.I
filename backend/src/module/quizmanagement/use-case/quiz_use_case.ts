import { injectable, inject } from 'tsyringe';
import { IQuizRepository } from '../repository/i_quiz_repository';
import { Quiz, Question, Option } from '../../../shared/entitie/quiz_type';

@injectable()
export class CreateQuizUseCase {
    constructor(
        @inject('QuizRepository')
        private quizRepository: IQuizRepository
    ) {}

    async execute(data:{
        titulo: string;
        tipo: 'kahoot' | 'clicar_objeto';
        atividade_id?: number;
        pergunta: string;
        opcoes: Array<{ texto: string; correta: boolean}>;
    }): Promise<Quiz>{
        if (!data.titulo || !data.tipo || !data.pergunta || !data.opcoes) {
            throw new Error('Todos os campos são obrigatórios');
        }

        if (data.opcoes.length < 2) {
            throw new Error('O quiz deve ter pelo menos 2 opções');
        }

        const correctOptions = data.opcoes.filter(opt => opt.correta);
        if (correctOptions.length !== 1) {
            throw new Error('Deve haver exatamente uma opção correta');
        }

        const quiz = await this.quizRepository.createQuiz({
            titulo: data.titulo,
            tipo: data.tipo,
            atividade_id: data.atividade_id || null
        });


        const question = await this.quizRepository.createQuestion({
            texto: data.pergunta,
            quiz_id: quiz.id!
        });

        const options = await Promise.all(
            data.opcoes.map(opt => 
                this.quizRepository.createOption({
                    texto: opt.texto,
                    correta: opt.correta,
                    pergunta_id: question.id!
                })
            )
        );

        return {
            ...quiz,
            perguntas: [{
                ...question,
                opcoes: options
            }]
        };
    }
}