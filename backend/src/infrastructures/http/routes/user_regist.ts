import { Router, Request, Response } from 'express';
import { executeQuery } from '../../../shared/database/mysql/db';
import { User } from '../../../domains/entities/user_type';

const router = Router();

router.post('/cad_user', async (req: Request, res: Response)=>{
    try {
        const {nome, email, password, role} : User = req.body;

        if(!nome || !email || !password || !role) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        const result = await executeQuery<User>('INSERT INTO usuarios (nome, email, password, role) VALUES (?, ?, ?, ?)', [nome, email, password, role]);

        const newUser: Omit<User, 'password'> = {
            nome,
            email,
            role
        };
        
        res.status(201).json({
            message: 'Usuário cadastrado com sucesso.',
            user: newUser
        });
    }catch (error: any) {
        if(error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email já cadastrado.' });
        }
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
    }
})

export default router;