
/**
 * @author: Jhordy Abonia
 * @email: jhordy.abonia@gmail.com
 * @fecha: 06-08-2025
 * 
 * Model/Tasks modelo de datos de la app/microservicion Tasks
 */
'use-strict'

import { TaskInteface } from "./TaskInteface"

class  Task implements TaskInteface {
    _id: number
    title: string
    status: "pending"
    priority: number
    description: string
    created_date: Date
    due_date: Date
    assigned_to: string
    author: string
    project_id: number
    tags = []
    permissions = []
    
    constructor() {}
    static STATUS = ["pending","prosessing","completed"]
    
    static parser = (data:Task):Task=>{
        const task = new Task()
        task._id            = data._id?data._id:task._id
        task.title          = data.title??task.title
        task.priority       = data.priority??task.priority
        task.status         = data.status??task.status
        task.description    = data.description??task.description
        task.created_date   = data.created_date??task.created_date
        task.due_date       = data.due_date??task.due_date
        task.assigned_to    = data.assigned_to??task.assigned_to
        task.author         = data.author??task.author
        task.project_id     = data.project_id??task.project_id
        task.tags           = data.tags??task.tags
        task.permissions    = data.permissions??task.permissions
        return task
    }
}

export { Task }