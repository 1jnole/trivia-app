import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultComponent } from './components/result/result.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ResultComponent],
  imports: [CommonModule, RouterModule],
  exports: [ResultComponent]
})
export class ResultModule {}
