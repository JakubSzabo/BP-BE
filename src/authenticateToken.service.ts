import { Request, Response, NextFunction } from 'express';
import {StatusCodes} from "./enums/statusCode.model";
import jwt from "jsonwebtoken";

const secret = 'SomeRandomText';

interface TokenPayload {
    userName: string;
    password: string;
    iat: number;
    exp: number;
}

export const validateToken = async (token: string): Promise<boolean> => {
    if (!token) {
        return false;
    }

    try {
        const decoded = jwt.verify(token, secret) as TokenPayload;

        const userName = decoded.userName;
        const password = decoded.password;

        console.log('UserName:', userName);
        console.log('Password:', password);

        return true;
    } catch (error) {
        console.error('Token validation error:', error);
        return false;
    }
};
const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(StatusCodes.Forbidden.code).send(StatusCodes.Forbidden.description);
    }

    const isValid = await validateToken(authHeader);
    if (!isValid) {
        return res.status(StatusCodes.Forbidden.code).send(StatusCodes.Forbidden.description);
    }

    next();
};

export default authenticateToken;