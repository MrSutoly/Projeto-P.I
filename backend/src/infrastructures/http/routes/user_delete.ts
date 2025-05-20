import {Router, Request, Response} from 'express';
import {executeQuery} from '../../../shared/database/mysql/db';
import {User} from '../../../domains/entities/user_type';

const router = Router();

router.delete('/delete/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'ID do usuário é obrigatório.' });
        }

        const result = await executeQuery(
            'DELETE FROM usuarios WHERE id = ?',
            [id],
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.json({ message: 'Usuário excluído com sucesso.' });
    } catch (error: any) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).json({ message: 'Erro ao excluir usuário.' });
    }
});

export default router;