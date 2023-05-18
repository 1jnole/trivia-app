import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { TriviaService } from '../../../../core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {
  public correctAnswersCount$!: Observable<number>;
  public successRate$!: Observable<number>;
  public totalQuestions!: number;
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _triviaService: TriviaService, private router: Router) {}

  ngOnInit() {
    this.correctAnswersCount$ = this._triviaService.correctAnswersCount;
    this._triviaService.currentQuestionIndex$
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(
        (totalQuestions) => (this.totalQuestions = totalQuestions + 1)
      );
    this.successRate$ = this._triviaService.correctAnswersCount.pipe(
      map((correctAnswers) => (correctAnswers / this.totalQuestions) * 100)
    );
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
    this._triviaService.resetVariables();
  }

  navigateToHome() {
    this.router.navigate(['home']);
  }
}
