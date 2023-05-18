import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TriviaService } from '../../core/services';

@Injectable({
  providedIn: 'root'
})
export class QuizGuard implements CanActivate {
  constructor(private triviaService: TriviaService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const totalQuestions = this.triviaService.getTotalQuestions();

    return this.triviaService.currentQuestionIndex$.pipe(
      map((currentQuestionIndex) => {
        if (
          currentQuestionIndex < 0 ||
          currentQuestionIndex >= totalQuestions
        ) {
          this.router.navigate(['/home']);
          return false;
        }
        return true;
      })
    );
  }
}
