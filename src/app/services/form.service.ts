import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type QuestionType = "paragraph" | "checkbox";
export type Question = {
  type: QuestionType,
  name: string,
  value: string[],
  required: boolean,
  isAllowed: boolean
};
export type ANSWER = {
  name: string,
  type: QuestionType,
  isRequired: boolean,
  value: any
}


@Injectable({
  providedIn: 'root'
})
export class FormService {
  private listQuestion = new BehaviorSubject<Question[]>([]);
  temp: Question[] = []
  getListQuestion() {
    return this.listQuestion.asObservable()
  }
  setListQuestion(item: Question) {
    if (item) {
      this.temp.push(item);
      this.listQuestion.next(this.temp);
    }
  }

  setFinalAnswer(item: ANSWER[]) {
    localStorage.setItem('myData', JSON.stringify(item));
  }

  getFinalAnswer(): ANSWER[] {
    const data = localStorage.getItem('myData');
    if (data) {
      return JSON.parse(data);
    }
    return []
  }
}
