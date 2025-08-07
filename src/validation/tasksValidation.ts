import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { expressjwt, GetVerificationKey } from 'express-jwt';
import jwt from 'jsonwebtoken';

const secret =  process.env.SECRET_KEY ?? 'secret-key';

const taskSchema = Joi.object({
  _id: Joi.number().required(),
  title: Joi.string().required(),
  author: Joi.string().email(),
  assigned_to: Joi.string().email()
});

const validateTasks = (req: Request, res: Response, next: NextFunction) => {
  const { error } = taskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({status:"error",data: error.details[0].message });
  }
  next();
};

const validateTasksId = (req: Request, res: Response, next: NextFunction) => {
  const idRequired = Joi.object({_id: Joi.number().required()})
  const { error }  = idRequired.validate(req.params);
  if (error) {
    return res.status(400).json({status:"error",data: error.details[0].message });
  }
  next();
};

const handleAuthErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Token inválido o expirado', error: err.message });
  }
  next(err);
};

const generateToken = (payload: any) => {
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

const authenticateToken = expressjwt({
  secret: secret as unknown as GetVerificationKey,
  algorithms: ['HS256'], 
  requestProperty: 'auth', 
});

export {validateTasks,validateTasksId,handleAuthErrors,authenticateToken,generateToken}