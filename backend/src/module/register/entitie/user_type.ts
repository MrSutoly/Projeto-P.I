export type UserRole = 'admin' | 'professor' | 'aluno';

 export type UserRegi = { 
    id?: number,
    nome: string,
    email: string,
    password: string,
    role: UserRole,
}