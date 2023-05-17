import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public triviaForm!: FormGroup;
  public amountOptions: number[] = [5, 10, 15, 20];
  public difficultyOptions: string[] = ['easy', 'medium', 'hard'];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.triviaForm = this.fb.group({
      amount: ['', Validators.required],
      difficulty: ['', Validators.required]
    });
  }

  public startGame(): void {
    const amount = this.triviaForm?.value?.amount;
    const difficulty = this.triviaForm?.value?.difficulty;
    this.router.navigate(['questions'], {
      queryParams: { amount, difficulty }
    });
  }
}
