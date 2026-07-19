import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { Task } from "./Task";
import { NgFor, NgIf } from "@angular/common";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { featherCalendar } from "@ng-icons/feather-icons";
import { RemoveItemButtonComponent } from "./remove-item-button.component";
import { AutosizeTextareaComponent } from "./autosize-textarea.component";
import { TasksService } from "./tasks.service";

@Component({
  selector: "app-tasks-list",
  standalone: true,
  viewProviders: [provideIcons({ featherCalendar })],
  imports: [
    NgFor,
    NgIconComponent,
    NgIf,
    RemoveItemButtonComponent,
    AutosizeTextareaComponent,
  ],
  template: `
    <ul>
      <li *ngFor="let task of tasks" class="mb-2">
        <div
          class="rounded-md shadow-md p-4 block"
          [class.bg-green-300]="task.done"
        >
          <button
            class="w-full"
            (click)="handleSingleClick(task)"
            (dblclick)="switchToEditMode(task.id)"
          >
            <header class="flex justify-end">
              <app-remove-item-button (confirm)="onDelete.emit(task.id)" />
            </header>
            <section class="text-left">
              <app-autosize-textarea
                *ngIf="
                  editMode && task.id === currentTaskInEdit;
                  else previewModeTemplate
                "
                (keyup.escape)="editMode = false"
                [value]="task.name"
                (submitText)="update($event, task.id)"
              />

              <ng-template #previewModeTemplate>
                <span [class.line-through]="task.done">
                  {{ task.name }}
                </span>
              </ng-template>
            </section>
            <footer class=" pt-2 flex items-center justify-end">
              <ng-icon name="featherCalendar" class="text-sm" />
            </footer>
          </button>
        </div>
      </li>
    </ul>
  `,
  styles: [],
})
export class TasksListComponent {
  @Input({ required: true }) tasks: Task[] = [];
  @Output() onDelete = new EventEmitter<number>();

  removeMode = false;
  editMode = false;

  currentTaskInEdit: number | null = null;

  isSingleClick = true;
  private tasksService = inject(TasksService);

  update(updatedName: string, taskId: number) {
    this.tasksService.update(updatedName, taskId);
  }

  handleSingleClick(task: Task) {
    this.isSingleClick = true;

    setTimeout(() => {
      if (this.isSingleClick) {
        this.toggleDoneStatus(task);
      }
    }, 150);
  }

  switchToEditMode(taskId: number) {
    this.isSingleClick = false;
    this.editMode = true;
    this.currentTaskInEdit = taskId;
  }

  toggleDoneStatus(task: Task) {
    task.done = !task.done;
  }
}

// TO DO
// 1. Usuwanie bez koniecznosci odswiezenia / DONE
// 2. Jednoczesna edycja tylko jednego taska / DONE
// 3. Przy edycji enter chowa tekst
