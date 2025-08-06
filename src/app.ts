

/**
 * @author: Jhordy Abonia
 * @email: jhordy.abonia@gmail.com
 * @fecha: 06-08-2025
 * */
'use-strict'
import express from 'express';
import { TaskController } from "./controllers/TaskController"

const server = async (port: number)=>{
    const app = express();
    const router = await TaskController()

    app.use(express.json());
    app.use('/tasks/', router);
    app.listen(port);
}

server(3008)