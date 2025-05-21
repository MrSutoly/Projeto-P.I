export type JWTPayload = {
    id: number;
    email: string;
    role: 'admin' | 'professor' | 'aluno';
}