import { NextFunction, Request, Response } from 'express';
import extractUser from '../helpers/auth/extractUser';

export interface AuthRequest extends Request {
  user: any;
}

export default async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const Authorization = req?.get('Authorization');
  if (Authorization) {
    const user = await extractUser(Authorization);
    if (user) {
      // @ts-ignore
      req.user = user;
      return next();
    }
  }
  return res.status(401).send('Unauthorized');
}
