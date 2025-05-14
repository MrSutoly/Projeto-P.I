import { Router, Request, Response } from 'express';
import { executeQuery } from '../../data/db';
import { User } from '../../types/user_type';

const router = Router();


router.get('/get/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'ID do usuário é obrigatório.' });
        }

        const user = await executeQuery<User[]>(
            'SELECT * FROM usuarios WHERE id = ?',
            [id],
        );

        if (user.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.json(user[0]);
    } catch (error: any) {
        console.error('Erro ao obter usuário:', error);
        res.status(500).json({ message: 'Erro ao obter usuário.' });
    }
});

export default router;