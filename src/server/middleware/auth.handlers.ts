import { NextFunction, Request, Response, RequestHandler } from "express";
import jwt from 'jsonwebtoken';
import { User } from "../../shared/models/user.model.js";
interface IGetUserAuthInfoRequest extends Request {
    user: User // or any other type
}

export const authenticateToken = (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => { 
    const cookie = req.cookies['jwt'];
    console.log('cookie', cookie);
    jwt.verify(cookie, process.env.ACCESS_TOKEN_SECRET as string, (error: any, result: any) => {
        if (error) {
            return res.sendStatus(403);
            
        }
        if (result) {
               req.user = result.user;
        }
        next();
    });
};
export const authHandler = authenticateToken as RequestHandler;