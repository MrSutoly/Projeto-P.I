export type UserRole = 'admin' | 'professor' | 'aluno';

 export type User = { 
    id?: number,
    nome: string,
    email: string,
    password: string,
    role: UserRole,
    turma_id?: number, 
}