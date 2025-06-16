export type JWTPayload = {
    id: number;
    nome: string;
    email: string;
    role: 'admin' | 'professor' | 'aluno';
}