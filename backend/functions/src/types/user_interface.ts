type UserRole = 'admin' | 'teacher' | 'student';

 type User ={
    id?: number,
    nome: string,
    email: string,
    password: string,
    role: UserRole,
    turma_id?: number;
}