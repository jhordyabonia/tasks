
/**
 * @author: Jhordy Abonia
 * @email: jhordy.abonia@gmail.com
 * @fecha: 06-08-2025
 * 
 * Repository/Tasks para la gestion del los datos de la app/microservicion Tasks
 */
'use-strict'
import { Task } from './Task';
import { MongoClient } from 'mongodb';

const dbName = process.env.MONGODB_NAME ?? "jiraCBW";
const PORT = process.env.MONGODB_PORT ?? 27017
const URL = process.env.MONGODB_URL ?? "mongodb://mongo"
const uri = `${URL}:${PORT}`

const client = new MongoClient(uri);

class  TaskRepository {
    tasks = null
    constructor () {                             
        try {
            const database = client.db(dbName);
            this.tasks = database.collection("tasks");        
        } catch (e) {
            console.error("\n❌ Ocurrió un error:", e);
        } finally {
            console.log(">>>");
        }
    }
    /**
     * @method start Inicia conexion con base de datos mongodb
     */
    start = async function() {
        await client.connect();
    }
    
    /**
     * @method stop detiene conexion con base de datos mongodb
     */
    stop = async function() {
        await client.close();
        console.log("\n✅ Conexión cerrada.");
    }

    /**
     * @method post inserta item Tasks en base de datos mongodb
     * @param task item Tasks a insertar de base de datos
     */
    post = async(task: Task)=>{        
        const {insertedId} = await this.tasks.insertOne(task);
        return insertedId       
    }    
    
    /**
     * @method get obtine el item Tasks con _id=id de base de datos mongodb
     */
    get = async(id:number)=>{
        return await this.tasks.findOne({ _id:id });
    }
    
    /**
     * @method gatAll Obetinela lista de items Tasks de la base de datos mongodb
     * coincidentes que query
     * @param query filtro: obejeto tipo Tasks
     */
    getAll = async(query:object={})=>{
        return await this.tasks.find(query).toArray();
    }

    /**
     * @method put actualiza completamente el item Tasks  con _id=id en base de datos mongodb
     * @param task objecto a actualizar
     */
    put = async(task: { _id: number })=>{
        return await this.tasks.findOneAndUpdate({_id:task._id},{$set:task});
    }
    
    /**
     * @method delete elimina completamente el item Tasks  con _id=id de la base de datos mongodb
     * @param id it Tasks a eliminar
     */
    delete = async( id: number )=>{
        const {deletedCount} = await this.tasks.deleteOne({ _id: id });
        return deletedCount
    }
    
}

export { Task,TaskRepository }