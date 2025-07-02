export type Album = {
    id?: number;
    nome: string;
    descricao?: string;
    data_criacao: Date;
    turma_id?: number;
    criado_por: number;
}

export type Photo = {
    id?: number;
    url: string;
    legenda?: string;
    data_upload?: Date;
    album_id: number;
    upload_por: number;
}