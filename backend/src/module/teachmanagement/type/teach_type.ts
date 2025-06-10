import { Quiz, Question, Option } from '../../../shared/entitie/quiz_type';
import { Class } from '../../../shared/entitie/class_type';

export type TeacherSession = {
    id?: number;
    quiz_id: number;
    professor_id: number;
    turma_id: number;
    status: 'aguardando' | 'em_andamento' | 'finalizado';
    pergunta_atual: number;
    codigo_acesso: string;
    criado_em?: Date;
}

export type StudentResponse = {
    id?: number;
    sessao_id: number;
    aluno_id: number;
    pergunta_id: number;
    resposta_id: number;
    tempo_resposta?: number;
    respondido_em?: Date;
}

export type ConnectedStudent = {
    id?: number;
    sessao_id: number;
    aluno_id: number;
    status: 'conectado' | 'desconectado';
    conectado_em?: Date;
}