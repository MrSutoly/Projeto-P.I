import { injectable } from 'tsyringe';
// ===================== PRODUÇÃO =====================
import { findOne } from "../../../shared/database/supabase/db"; // DESCOMENTAR para produção
import bcrypt from 'bcrypt';                                     // DESCOMENTAR para produção
import { User } from '../../../shared/util/entities/user_type';
import { ILoginRepository } from "./i_login_repository";

// ===================== MOCK PARA TESTES =====================
// const MOCK_USER: User = {
//     id: 1,
//     nome: 'Professor Teste',
//     email: 'admin@teste.com',
//     password: '', 
//     role: 'admin', // Mantendo como professor pra não quebrar
//     turma_id: 1
// };
// const MOCK_PASSWORD = '123456';

// // testar outros roles:
// // role: 'admin',     // testar como admin
// // role: 'professor', // testar como professor 
// // role: 'aluno',     // testar como aluno
// // ============================================================

 @injectable()
 export class LoginRepository implements ILoginRepository {    
    // // ================= MOCK PRA TESTES =================

    // async findbyEmail(email: string): Promise<User | null> {
    //     if (email === MOCK_USER.email) {
    //         return MOCK_USER;
    //     }
    //     return null;
    // }
    // async validPassword(password: string, _hash: string): Promise<boolean> {
    //     return password === MOCK_PASSWORD;
    // }

    // // ====================================================

    // ================= LÓGICA REAL DE PRODUÇÃO =================
    
   
   async findbyEmail(email: string): Promise<User | null> {
        const user = await findOne<User>(
            'usuarios',
            { email }
        );
        
        return user;
    }
    
    async validPassword(password: string, hash: string): Promise<boolean> {
        try {
            if (!hash || hash.trim() === '') {
                return false;
            }
            if (!hash.startsWith('$2b$')) {
                return false;
            }
            
            const validPass = await bcrypt.compare(password, hash);
            return validPass;
        } catch (error) {
            console.error('Erro na validação de senha');
            return false;
        }
    }   

    
    /* MEU DEEEEEEEUS CARALHO NADA FUNCIONA NESSA PORRA

    async findbyEmail(email: string): Promise<User | null> {
        const [user] = await executeQuery<User[]>(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );
        return user || null;
    }
    async validPassword(password: string, hash: string): Promise<boolean> {
        try {
            if (!hash || hash.trim() === '') {
                return false;
            }
            if (!hash.startsWith('$2b$')) {
                return false;
            }
            const validPass = await bcrypt.compare(password, hash);
            return validPass;
        } catch {
            return false;
        }
    }
    */
    // ===========================================================
}