import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const taskSchema = Joi.object({
  _id: Joi.number().required(),
  title: Joi.string().required(),
  author: Joi.string().email(),
  assigned_to: Joi.string().email()
});

const validateTasks = (req: Request, res: Response, next: NextFunction) => {
  const { error } = taskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateTasksId = (req: Request, res: Response, next: NextFunction) => {
  const idRequired = Joi.object({_id: Joi.number().required()})
  const { error }  = idRequired.validate(req.params);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
export {validateTasks,validateTasksId}