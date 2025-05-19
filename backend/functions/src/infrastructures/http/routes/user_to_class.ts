import { Router, Request, Response } from 'express';
import { executeQuery } from '../../databases/mysql/db';
import { Class } from '../../../domains/entities/class_type';
import { User } from '../../../domains/entities/user_type';

const router = Router();

router.put('/cad_user_class', async (req: Request, res: Response) => {
    
    const { user_id, codigo } = req.params;

    const [turma] = await executeQuery<Class[]>(
        'SELECT * FROM turmas WHERE codigo = ?',
        [codigo],
    );
    if (!turma) {
        return res.status(404).json({ message: 'Turma não encontrada.' });
    }

    const usuario = await executeQuery<User[]>(
        'SELECT * FROM usuarios WHERE id = ? AND role = "aluno"',
        [user_id],
    );

    if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const result = await executeQuery('UPDATE usuarios SET turma_id = ? WHERE id = ?', [turma.id, user_id]);

    res.json({
        message: 'Usuário adicionado à turma com sucesso.',
        user: {
            id: user_id,
            turma_id: turma.id
        }
    })
})

export default router;