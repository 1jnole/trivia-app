import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home';
import { QuestionComponent } from './modules/question';
import { ResultComponent } from './modules/result';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'questions',
    data: {
      queryParams: ['amount', 'difficulty']
    },
    component: QuestionComponent
  },
  { path: 'result', component: ResultComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
