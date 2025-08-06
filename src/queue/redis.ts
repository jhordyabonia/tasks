
/**
 * @author: Jhordy Abonia
 * @email: jhordy.abonia@gmail.com
 * @fecha: 06-08-2025
 * 
 * queue para la gestion de tareas asincronas de la app/microservicion Tasks
 */
'use-strict'

import { Queue,Worker } from 'bullmq';

const TASK_QUEUE = process.env.REDIS_TASK_QUEUE ?? "task-queue"

const redisConnection = {
  host:  process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379
};

const schedule = async (req, res) => {
  const { id } = req.params;
  const { due_date, message } = req.body;

  if (!due_date || !message) {
    return res.status(400).json({ error: 'due_date y message son requeridos.' });
  }

  const delay = new Date(due_date).getTime() - Date.now();

  if (delay <= 0) {
    return res.status(400).json({ error: 'La due_date debe ser en el futuro.' });
  }
  try{
    const taskQueue = new Queue(TASK_QUEUE, { connection:redisConnection}); 
    await taskQueue.add(
        'sendReminderNotification', 
        { taskId: id, message },      
        { delay }                     
    );
  }catch(e){
    return res.status(400).json({ error: e});  
  }
  console.log(`🔔 Trabajo de recordatorio programado para la tarea ${id}. Se ejecutará en ${Math.round(delay/1000)} segundos.`);
  res.status(202).json({ message: `Recordatorio para la tarea ${id} programado.` });
}

const cron = ()=>{
    console.log('👷 Iniciando worker...');
    
    const worker = new Worker(TASK_QUEUE,async (job:any) => {
        console.log(`\nProcessing job #${job.id} with name ${job.name}`);
        console.log('Datos recibidos:', job.data);

        if (job.name === 'sendReminderNotification') {
            const { taskId, message } = job.data;
            console.log(`Enviando recordatorio para la tarea ${taskId}: "${message}"`);

            await new Promise(resolve => setTimeout(resolve, 1000));
        } 
        
        else if (job.name === 'generateReport') {
            const { userId } = job.data;
            console.log(`Generando reporte para el usuario ${userId}... esto tomará tiempo.`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            console.log(`✅ Reporte para el usuario ${userId} completado.`);
        }

        return { status: 'Completado', jobId: job.id };

    }, { connection: redisConnection })

    worker.on('completed', (job, result) => {
     console.log(`Job #${job.id} completado con resultado:`, result.status);
    });

    worker.on('failed', (job, err) => {
        console.error(`Job #${job.id} falló con error:`, err.message);
    });
}
export { schedule,cron }