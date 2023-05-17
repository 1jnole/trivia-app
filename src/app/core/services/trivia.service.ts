import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { TriviaInterfaceDto } from '../../shared';
import { QuestionModel } from '../../shared';

@Injectable({
  providedIn: 'root'
})
export class TriviaService {
  private _basePath = 'https://opentdb.com/api.php';
  private _questionsSubject$: BehaviorSubject<QuestionModel[]> =
    new BehaviorSubject<QuestionModel[]>([]);
  private _currentQuestionSubject: BehaviorSubject<QuestionModel | null> =
    new BehaviorSubject<QuestionModel | null>(null);
  public currentQuestion$: Observable<QuestionModel | null> =
    this._currentQuestionSubject.asObservable();
  private _currentQuestionIndexSubject$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  public currentQuestionIndex$: Observable<number> =
    this._currentQuestionIndexSubject$.asObservable();

  private _correctAnswersCount$ = new BehaviorSubject<number>(0);
  public correctAnswersCount: Observable<number> =
    this._correctAnswersCount$.asObservable();

  constructor(private http: HttpClient) {}

  fetchQuestions(
    question: number,
    amount: number,
    difficulty: string
  ): Observable<QuestionModel[]> {
    const url = `${this._basePath}?amount=${amount}&difficulty=${difficulty}`;
    return this.http.get<TriviaInterfaceDto>(url).pipe(
      map((response) =>
        response.results.map((_question) => ({
          ..._question,
          options: this.shuffleOptions([
            _question.correct_answer,
            ..._question.incorrect_answers
          ])
        }))
      )
    );
  }

  loadQuestions(
    question: number,
    amount: number,
    difficulty: string
  ): Observable<QuestionModel[]> {
    return this.fetchQuestions(question, amount, difficulty).pipe(
      tap((questions) => {
        this._questionsSubject$.next(questions);
        this._currentQuestionSubject.next(questions[question - 1]);
        this._currentQuestionIndexSubject$.next(0);
      })
    );
  }

  shuffleOptions(options: string[]): string[] {
    return options.sort(() => Math.random() - 0.5);
  }

  nextQuestion(): void {
    const nextIndex = this._currentQuestionIndexSubject$.value + 1;
    this._currentQuestionIndexSubject$.next(nextIndex);
    this._currentQuestionSubject.next(this._questionsSubject$.value[nextIndex]);
  }

  incrementCorrectAnswersCount(): void {
    const currentCount = this._correctAnswersCount$.getValue();
    this._correctAnswersCount$.next(currentCount + 1);
  }

  getTotalQuestions(): number {
    return this._questionsSubject$.value.length;
  }
}
