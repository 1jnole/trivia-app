import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionComponent } from './components/question/question.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [QuestionComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class QuestionModule {}
