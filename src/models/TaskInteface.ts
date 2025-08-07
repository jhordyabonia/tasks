
/**
 * @author: Jhordy Abonia
 * @email: jhordy.abonia@gmail.com
 * @fecha: 06-08-2025
 * 
 * Model/Tasks modelo de datos de la app/microservicion Tasks
 */
'use-strict'

interface  TaskInteface {

    _id:number
    title:string
    status:string
    priority:number
    description:string
    created_date:Date        
    due_date:Date
    assigned_to:string
    author:string
    project_id:number
}
export { TaskInteface }