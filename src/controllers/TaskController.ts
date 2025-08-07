
/**
 * @author: Jhordy Abonia
 * @email: jhordy.abonia@gmail.com
 * @fecha: 06-08-2025
 * 
 * Controller/Router para la gestion de la app/microservicion Tasks
 */
'use-strict'
import express from 'express';

import {Task,TaskRepository} from "../models/TaskRepository"
import {schedule} from "../queue/redis"
import { validateTasks } from '~/validation/tasksValidation';

const response = (data: any,status:string="ok")=>{
    return {status:status,data:data}
}

const TaskController = async ()=>{

    const repository = new TaskRepository()
    await repository.start()

    const router = express.Router();
    router.post('/', validateTasks,async (req, res) => {
        const task = Task.parser(req.body)        
        try{
            const idInsert = await repository.post(task)        
            res.status(200).json(response(idInsert));
        }catch(error){            
            res.status(422).json(response(error,"error"));
        }
    });

    router.get('/', async (req, res) => {        
        const tasks = await repository.getAll()
        res.status(200).json(response(tasks));        
    });

    router.get('/:id', async (req, res) => {
        const taskId = parseInt(req.params.id)
        if (!Number.isNaN(taskId)){
            const task = await repository.get(taskId)
            if (task == null){
                res.status(404).json(response("Tasks not found!","error"));
            }else{
                res.status(200).json(response(task));
            }
        }else{
            res.status(422).json(response("_id must be a number","error"));
        }
    });

    router.get('/status/:status', async (req, res) => {
        if (Task.STATUS.indexOf(req.params.status) > -1){
            const query = {status:req.params.status}
            const task = await repository.getAll(query)
            res.status(200).json(response(task));
        }else{
            res.status(422).json(response(`status '${req.params.status}' not found!`,"error"));
        }
    });

    router.post('/:id/schedule',schedule);

    router.put('/:id', async (req, res) => {
        const taskId = parseInt(req.params.id)
        const task = Task.parser(req.body)
        task._id = taskId
         try{
            const idInsert = await repository.put(task)        
            res.status(200).json(response(idInsert));
        }catch(error){            
            res.status(422).json(response(error,"error"));
        }
    });

    router.patch('/:id', async (req, res) => {
        const taskId = parseInt(req.params.id)
        const task = req.body
        task._id = taskId
         try{
            const idInsert = await repository.put(task)        
            res.status(200).json(response(idInsert));
        }catch(error){            
            res.status(422).json(response(error,"error"));
        }
    });

    router.delete('/:id', async (req, res) => {
        try{
            const taskId = parseInt(req.params.id)
            const deletedCount = await repository.delete(taskId)
            res.status(200).json(response(deletedCount));
        }catch(error){            
            res.status(422).json(response(error,"error"));
        }
    });
    return router
}

export { TaskController,TaskRepository,Task }