import {Router, Request, Response} from 'express';
import {executeQuery} from '../../data/db';
import {User} from '../../types/user_type';

const router = Router();

router.get('/get', async (req: Request, res: Response) => {
    try{
        const users = await executeQuery<User[]>(
            'Select * from usuarios',
        );

        res.json(users);
    }catch(error: any) {
        console.error('Erro ao obter usuários:', error);
        res.status(500).json({message: 'Erro ao obter usuários.'});
    }
})

export default router;