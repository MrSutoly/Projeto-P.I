export type Album = {
    id?: number;
    titulo: string;
    descricao: string;
    imagemUrl: string;
    turma: string;
    data: string;
    tipo: 'foto' | 'video' | 'documento';
    created_at?: string;
    updated_at?: string;
}

export type CreateAlbumRequest = {
    titulo: string;
    descricao: string;
    imagemUrl: string;
    turma: string;
    data: string;
    tipo: 'foto' | 'video' | 'documento';
} 