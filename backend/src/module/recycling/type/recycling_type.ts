export type RecyclingEntry = {
    id?: number;
    turma_id: number;
    professor_id: number;
    pontos: number;
    motivo: string;
    criado_em?: Date;
}; 