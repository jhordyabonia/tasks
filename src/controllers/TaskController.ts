
/**
 * 
 */
'use-strict'
import express from 'express';

import {Task,TaskRepository} from "../models/TaskRepository"
import {schedule} from "../queue/redis"

const TaskController = async ()=>{

    const repository = new TaskRepository()
    await repository.start()

    const router = express.Router();
    router.post('/', async (req, res) => {
        const task = Task.parser(req.body)
        
        try{
            const idInsert = await repository.post(task)        
            res.status(200).send(""+idInsert);
        }catch(error){            
            res.status(500).send(JSON.stringify(error,null,4));
        }
    });

    router.get('/', async (req, res) => {        
        const tasks = await repository.getAll()
        res.status(200).send(JSON.stringify(tasks,null,4));        
    });

    router.get('/:id', async (req, res) => {
        const taskId = parseInt(req.params.id)
        if (taskId > 0){
            const task = await repository.get(taskId)
            res.status(200).send(JSON.stringify(task,null,4));
        }
    });

    router.get('/status/:status', async (req, res) => {
        if (Task.STATUS.indexOf(req.params.status) > -1){
            const query = {status:req.params.status}
            const task = await repository.getAll(query)
            res.status(200).send(JSON.stringify(task,null,4));
        }else{
            const error = {
                status:500,
                error:`status '${req.params.status}' not found!`
            }
            res.status(500).send(JSON.stringify(error,null,4));
        }
    });

    router.post('/:id/schedule',schedule);

    router.put('/:id', async (req, res) => {
        const taskId = parseInt(req.params.id)
        const task = Task.parser(req.body)
        task._id = taskId
         try{
            const idInsert = await repository.put(task)        
            res.status(200).send(JSON.stringify(idInsert,null,4));
        }catch(error){            
            res.status(500).send(JSON.stringify(error,null,4));
        }
    });

    router.patch('/:id', async (req, res) => {
        const taskId = parseInt(req.params.id)
        const task = req.body
        task._id = taskId
         try{
            const idInsert = await repository.put(task)        
            res.status(200).send(JSON.stringify(idInsert,null,4));
        }catch(error){            
            res.status(500).send(JSON.stringify(error,null,4));
        }
    });

    router.delete('/:id', async (req, res) => {
        try{
            const taskId = parseInt(req.params.id)
            const deletedCount = await repository.delete(taskId)
            res.status(200).send(JSON.stringify(deletedCount));
        }catch(error){            
            res.status(500).send(JSON.stringify(error,null,4));
        }
    });
    return router
}

export { TaskController,TaskRepository,Task }