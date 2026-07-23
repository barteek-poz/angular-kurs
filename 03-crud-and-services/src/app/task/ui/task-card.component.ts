import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../model/Task';
import { TasksService } from '../data-access/tasks.service';
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { AutosizeTextareaComponent } from 'src/app/ui/autosize-textarea.component';
import { RemoveItemButtonComponent } from 'src/app/ui/remove-item-button.component';
import { TaskUpdatePayload } from 'src/app/utils/list-state.type';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, RemoveItemButtonComponent, AutosizeTextareaComponent, NgIconComponent],
  template: `
    <div
          class="rounded-md shadow-md p-4 block"
          [class.bg-green-300]="task.done"
        >
          <button
            class="w-full"
            (click)="!editMode && handleSingleClick()"
            (dblclick)="switchToEditMode()"
          >
            <header class="flex justify-end">
              <app-remove-item-button (confirm)="deleteTask.emit()" />
            </header>
            <section class="text-left">
              <app-autosize-textarea
                *ngIf="
                  editMode;
                  else previewModeTemplate
                "
                (keyup.escape)="editMode = false"
                [value]="task.name"
                (submitText)="update($event)"
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
  `,
  styles: [
  ]
})
export class TaskCardComponent {
@Input({ required: true }) task!: Task;
@Output() deleteTask = new EventEmitter();
@Output() updateTask = new EventEmitter<TaskUpdatePayload>();

  removeMode = false;
  editMode = false;

   

  isSingleClick = true;
  

  update(updatedName: string) {
    this.updateTask.emit({
      name: updatedName, 

    });
  }

  handleSingleClick() {
    this.isSingleClick = true;
    this.updateTask.emit({done: !this.task.done}) 
  }

  switchToEditMode() {
    this.isSingleClick = false;
    this.editMode = true;
  }

}
