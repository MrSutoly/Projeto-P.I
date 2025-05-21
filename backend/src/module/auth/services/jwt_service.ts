import { injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types/jwt_payload';
import { User } from '../../login/entitie/user_type';

export class JWTService {
    private secretKey = process.env.JWT_SECRET || 'default_secret_key';

    generateToken(user: Omit<User, 'password'>): string {
        const payload: JWTPayload = {
            id: user.id!,
            email: user.email,
            role: user.role,
        };

        return jwt.sign(payload, this.secretKey, { expiresIn: '1d' });
    }
    
    verifyToken(token: string): JWTPayload | null {
        return jwt.verify(token, this.secretKey) as JWTPayload;
    }
}