import { Injectable } from "@angular/core";
import { ListFetchingError } from "./list-state.type";
import { Task } from "./Task";


const URL = "http://localhost:3000"

export async function getTasks() {
  return fetch(`${URL}/tasks`)
  .then<Task[] | ListFetchingError>((response) => {
        if (response.ok) {
          return response.json();
        }
        return { status: response.status, message: response.statusText };
      })
}

export async function addTasks(name:string) {
  return fetch(`${URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        createdAt: new Date().getTime(),
        name, 
        done: false, 
      } as Task)
    }).then<Task | Error>( response => {
      if(response.ok) {
        return response.json()
      }
      return new Error('Cannot add task')
    })
}

@Injectable({
    providedIn: 'root',
})
export class TasksService {
   private URL = "http://localhost:3000"

   async getAll() {
        return fetch(`${this.URL}/tasks`)
        .then<Task[] | ListFetchingError>((response) => {
            if (response.ok) {
            return response.json();
            }
            return { status: response.status, message: response.statusText };
        })
    }

    async add(name:string){
      return fetch(`${this.URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        createdAt: new Date().getTime(),
        name, 
        done: false, 
      } as Task)
    }).then<Task | Error>( response => {
      if(response.ok) {
        return response.json()
      }
      return new Error('Cannot add task')
    })
    }

    async delete(taskId: number) {
        return fetch(`${this.URL}/tasks/${taskId}`, {
            method: 'DELETE'
        }).then<undefined | Error>(response => {
            if(response.ok) {
                return response.json()
            }
            return new Error("Cannot delete this task")
        })
    }

    async update(name:string, taskId:number) {
       return fetch(`${this.URL}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name
      })
    }).then<Task | Error>( response => {
      if(response.ok) {
        return response.json()
      }
      return new Error('Cannot update this task')
    })
    }
}