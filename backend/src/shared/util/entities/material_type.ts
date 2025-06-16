export type Material = {
    id?: number;
    titulo: string;
    semana: number;
    topico: string;
    data: string;
    link: string;
    tipo: 'slide' | 'apostila' | 'video' | 'documento';
    created_at?: string;
    updated_at?: string;
}

export type CreateMaterialRequest = {
    titulo: string;
    semana: number;
    topico: string;
    data: string;
    link: string;
    tipo: 'slide' | 'apostila' | 'video' | 'documento';
} 