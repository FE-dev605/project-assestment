import { Component, OnInit } from '@angular/core';
import { ANSWER, FormService } from '../../services/form.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-answers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './answers.component.html',
  styleUrl: './answers.component.scss'
})
export class AnswersComponent implements OnInit {
  constructor(
    private formSvc: FormService
  ) { }

  listAnswer: ANSWER[] = [];
  ngOnInit(): void {
    this.listAnswer = this.formSvc.getFinalAnswer();
    console.log(this.listAnswer);
  }

}
