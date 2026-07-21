import { Component, inject } from "@angular/core";
import { TasksListComponent } from "./ui/tasks-list.component";
import { SubmitTextComponent } from "../ui/submit-text.component";
import { Task } from "./model/Task";
import { NgIf } from "@angular/common";
import { addTasks, getTasks, TasksService } from "./data-access/tasks.service";
import { ComponentListState } from "../utils/list-state.type";

@Component({
  selector: "app-task-list-page",
  standalone: true,
  imports: [TasksListComponent, SubmitTextComponent, NgIf],
  template: `
    <app-submit-text
      *ngIf="listState.state === 'success'"
      &&
      (submitText)="addTask($event, listState.results)"
    />
    <app-tasks-list
      *ngIf="listState.state === 'success'"
      class="block mt-4"
      [tasks]="listState.results"
      (onDelete)="delete($event)"
    />
    <p *ngIf="listState.state === 'error'">{{ listState.error.message }}</p>
    <p *ngIf="listState.state === 'loading'">Loading...</p>
  `,
})
export class TaskListPageComponent {
  listState: ComponentListState<Task> = { state: "idle" };

  taskService = inject(TasksService);

  ngOnInit() {
    this.listState = { state: "loading" };
    this.taskService.getAll().then((response) => {
      if (Array.isArray(response)) {
        this.listState = {
          state: "success",
          results: response,
        };
      } else {
        this.listState = {
          state: "error",
          error: response,
        };
      }
    });
  }

  addTask(name: string, tasks: Task[]) {
    this.taskService.add(name).then((response) => {
      if ("id" in response) {
        this.listState = {
          state: "success",
          results: tasks.concat(response),
        };
      } else {
        alert(response.message);
      }
    });
  }

  async delete(taskId: number) {
    if (this.listState.state !== "success") return;

    const res = await this.taskService.delete(taskId);
    if (!(res instanceof Error)) {
      this.listState = {
        state: "success",
        results: this.listState.results.filter((task) => task.id !== taskId),
      };
    } else {
      alert(res.message);
    }
  }
}
