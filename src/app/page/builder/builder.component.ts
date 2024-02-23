import { Component, OnDestroy, OnInit } from '@angular/core';
import { ANSWER, FormService, Question, QuestionType } from '../../services/form.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-builder',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule, ToastrModule],
  templateUrl: './builder.component.html',
  styleUrl: './builder.component.scss'
})


export class BuilderComponent implements OnInit, OnDestroy {

  constructor(
    private formService: FormService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  listQuestion: Question[] = [];
  listAnswer: (string | string[])[] = [];
  listOtherAnswer: string[] = [];
  shows: boolean[] = [];
  selectedOptions: { [key: string]: boolean } = {};

  finalAnswer: ANSWER[] = [];
  subcription: Subscription[] = [];

  ngOnDestroy(): void {
    this.subcription.forEach(res => res.unsubscribe())
  }

  ngOnInit(): void {
    var sub1 = this.formService.getListQuestion().subscribe((res: Question[]) => {
      this.listAnswer = [];
      if (res.length <= 0) {
        this.listQuestion = []
      } else {
        this.listQuestion = res
        for (let index = 0; index < res.length; index++) {
          this.listOtherAnswer.push('');
          this.shows.push(false);
          if (res[index].type == 'paragraph') {
            this.listAnswer.push('');
          } else {
            this.listAnswer.push([]);
          }
        }
      }
    })
    this.subcription.push(sub1)
  }

  private _validateAnswer(): boolean {
    for (let index = 0; index < this.finalAnswer.length; index++) {
      const element = this.finalAnswer[index];
      if (element.isRequired) {
        if (element.type == 'paragraph' && element.value == '') {
          this.alertError(element.name + ' is required')
          return false
        } else if (element.type == 'checkbox' && element.value.length == 0) {
          this.alertError(element.name + ' is required')
          return false
        }

      }
    }
    return true
  }

  alertSuccess() {
    this.toastr.success('Add question success');
  }

  alertError(item: string) {
    this.toastr.error(item);
  }

  private _handleOther() {
    var temp: any = [];
    for (let index = 0; index < this.listAnswer.length; index++) {
      const el = this.listAnswer[index];
      const other = this.listOtherAnswer[index];
      if (other != '') {
        (el as string[]).push('Other : ' + other)
        temp.push(el);
      } else {
        temp.push(el);
      }
    }
    this.listAnswer = temp;
  }

  public onCheckValue(index: number) {
    const selectedValues = Object.keys(this.selectedOptions).filter(key => this.selectedOptions[key]);
    this.listAnswer[index] = selectedValues
  }

  public onCheckOther(event: any, index: number) {
    this.shows[index] = event.target.checked;
    if (!event.target.checked) {
      this.listOtherAnswer[index] = ''
    }
  }

  public saveAnswer() {
    this._handleOther();
    this.finalAnswer = this.listAnswer.map((itm, i) => {
      var res: ANSWER = {
        name: this.listQuestion[i].name,
        type: this.listQuestion[i].type,
        isRequired: this.listQuestion[i].required,
        value: itm
      }
      return res
    })
    this._validateAnswer();
    this.formService.setFinalAnswer(this.finalAnswer);
    this.router.navigateByUrl('form/answers')

  }

}
