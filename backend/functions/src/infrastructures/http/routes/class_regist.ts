import { Router, Request, Response } from 'express';
import { executeQuery } from '../../databases/mysql/db';
import { Class } from '../../../domains/entities/class_type';
import crypto from 'crypto';

const router = Router();

router.post('/cad_class', async (req: Request, res: Response) => {
    const { nome }: Class = req.body;

    const codigo = crypto.randomBytes(3).toString('hex').toUpperCase();

    const result = await executeQuery<Class>('INSERT INTO classes (nome, codigo) VALUES (?, ?)', [nome, codigo]);

    const newClass: Class = {
        nome,
        codigo
    };

    res.status(201).json({
        message: 'Classe cadastrada com sucesso.',
        class: newClass
    });
})