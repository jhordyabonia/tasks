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

    start = async function() {
        await client.connect();
    }
    
    stop = async function() {
        await client.close();
        console.log("\n✅ Conexión cerrada.");
    }

    post = async(task: Task)=>{        
        const {insertedId} = await this.tasks.insertOne(task);
        return insertedId       
    }    
    
    get = async(id:number)=>{
        return await this.tasks.findOne({ _id:id });
    }
    
    getAll = async(query:object={})=>{
        return await this.tasks.find(query).toArray();
    }

    put = async(task: { _id: number })=>{
        return await this.tasks.findOneAndUpdate({_id:task._id},{$set:task});
    }
    
    delete = async( id: number )=>{
        const {deletedCount} = await this.tasks.deleteOne({ _id: id });
        return deletedCount
    }
    
}

export { Task,TaskRepository }