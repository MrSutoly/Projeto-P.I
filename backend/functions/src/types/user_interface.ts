export type UserRole = 'admin' | 'teacher' | 'student';

export interface User{
    id: number,
    name: string,
    email: string,
    password: string,
    role: UserRole,
}