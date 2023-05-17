import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { switchMap, takeUntil, map } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionModel } from '../../../../shared';
import { TriviaService } from '../../../../core/services';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit, OnDestroy {
  public currentQuestion$!: Observable<QuestionModel | null>;
  public currentQuestionIndex$!: Observable<number | null>;
  public progressPercentage!: number;
  public questionForm: FormGroup;
  public isCorrect = new BehaviorSubject<boolean | undefined>(undefined);
  public showNextButton$ = new BehaviorSubject<boolean>(false);

  private _ngUnsubscribe = new Subject<void>();
  private _totalQuestions!: number;

  constructor(
    private _triviaService: TriviaService,
    private _route: ActivatedRoute,
    private _fb: FormBuilder,
    private _router: Router
  ) {
    this.questionForm = this._fb.group({
      option: ''
    });
  }

  ngOnInit() {
    this._setUpCurrentQuestion();
    this._setUpCurrentQuestionIndex();
    this._setUpProgressPercentage();
  }

  public nextQuestion(): void {
    this._navigateToNextQuestion();
  }

  isAnswerCorrect(correctAnswer: string): void {
    const userAnswerIsCorrect =
      this.questionForm.get('option')?.value === correctAnswer;
    this.isCorrect.next(userAnswerIsCorrect);
    this.showNextButton$.next(true);

    if (userAnswerIsCorrect) {
      this._triviaService.incrementCorrectAnswersCount();
    }
  }

  setOptionToForm(option: string): void {
    this.questionForm.get('option')?.setValue(option);
  }

  private _navigateToNextQuestion() {
    this._triviaService.nextQuestion();
    this.isCorrect.next(undefined);
    this.showNextButton$.next(false);
    this.questionForm.reset();
  }

  private _setUpCurrentQuestion(): void {
    this.currentQuestion$ = this._route.queryParams.pipe(
      switchMap((params) => {
        this._totalQuestions = Number(params['amount']);
        return this._triviaService.loadQuestions(
          1,
          this._totalQuestions,
          params['difficulty']
        );
      }),
      map(() => this._triviaService.currentQuestion$),
      switchMap((currentQuestion$) => currentQuestion$),
      takeUntil(this._ngUnsubscribe)
    );
  }

  private _setUpCurrentQuestionIndex(): void {
    this.currentQuestionIndex$ = this._triviaService.currentQuestionIndex$;
    this._triviaService.currentQuestionIndex$
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((index) => {
        if (index + 1 === this._totalQuestions) {
          this._router.navigate(['/result']);
        }
      });
  }

  private _setUpProgressPercentage(): void {
    this._triviaService.currentQuestionIndex$
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((index) => {
        this.progressPercentage = (index / this._totalQuestions) * 100;
      });
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
