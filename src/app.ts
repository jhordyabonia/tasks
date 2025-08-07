

/**
 * @author: Jhordy Abonia
 * @email: jhordy.abonia@gmail.com
 * @fecha: 06-08-2025
 * */
'use-strict'
import express from 'express';
import { TaskController } from "./controllers/TaskController"
import swaggerUi from 'swagger-ui-express'
import {swaggerSpec, options} from './util/swagger';

const server = async (port: number)=>{
    const app = express();
    const router = await TaskController()

    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use(express.json());
    app.use('/tasks/', router);
    app.listen(port);
}

server(3008)