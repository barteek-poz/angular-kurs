import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { Task } from "../model/Task";
import { NgFor, NgIf } from "@angular/common";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { featherCalendar } from "@ng-icons/feather-icons";
import { RemoveItemButtonComponent } from "../../ui/remove-item-button.component";
import { AutosizeTextareaComponent } from "../../ui/autosize-textarea.component";
import { TasksService } from "../data-access/tasks.service";
import { TaskCardComponent } from "./task-card.component";
import { TaskUpdatePayload } from "src/app/utils/list-state.type";

@Component({
  selector: "app-tasks-list",
  standalone: true,
  viewProviders: [provideIcons({ featherCalendar })],
  imports: [
    NgFor,
    TaskCardComponent
],
  template: `
    <ul>
      <li *ngFor="let task of tasks" class="mb-2">
        <app-task-card [task]="task" (deleteTask)="onDelete.emit(task.id)" (updateTask)="update(task.id, $event)"/>
      </li>
    </ul>
  `,
  styles: [],
})
export class TasksListComponent {
  @Input({ required: true }) tasks: Task[] = [];
  @Output() onDelete = new EventEmitter<number>();
  @Output() onUpdate = new EventEmitter<{taskData:TaskUpdatePayload, taskId:number}>();
 
  private taskService = inject(TasksService);

  update(taskId:number, updatedTask: TaskUpdatePayload) {
    this.taskService.update(updatedTask, taskId).then(res => {
      if(res instanceof Error) {
        alert(res.message)
      } else {
        this.tasks = this.tasks.map(task => {
          if(task.id === res.id) {
            return res
          } else {
            return task
          }
        })
      }
    })
  }
}

// TO DO
// 1. Usuwanie bez koniecznosci odswiezenia / DONE
// 2. Jednoczesna edycja tylko jednego taska / DONE
// 3. Przy edycji enter chowa tekst
