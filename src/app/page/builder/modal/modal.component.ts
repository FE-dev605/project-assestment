import { Component, OnInit } from '@angular/core';
import { FormService, Question, QuestionType } from '../../../services/form.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { flush } from '@angular/core/testing';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ToastrModule
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  constructor(
    private formService: FormService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  questionData: Question = {
    type: 'paragraph',
    name: '',
    value: [],
    required: false,
    isAllowed: false
  }

  currentType: QuestionType = 'paragraph'

  paragraphName: string = ''
  isRequiredParagraph: boolean = false;

  listCheckBox: string[] = [];
  checkBoxName: string = '';
  isRequiredCheckBox: boolean = false;
  isAllowed: boolean = false;
  maxCheckBox: number = 0;
  private _addQuestion(): void {
    if (this.currentType == 'checkbox') {
      this.questionData = {
        type: 'checkbox',
        name: this.checkBoxName,
        value: this.listCheckBox,
        required: this.isRequiredCheckBox,
        isAllowed: this.isAllowed
      }
      this.formService.setListQuestion(this.questionData);
      return;
    }
    this.questionData = {
      type: 'paragraph',
      name: this.paragraphName,
      value: [],
      required: this.isRequiredParagraph,
      isAllowed: false
    }
    this.formService.setListQuestion(this.questionData)
  }

  private _resetValue() {
    this.questionData = {
      type: 'paragraph',
      name: '',
      value: [],
      required: false,
      isAllowed: false
    }
    this.currentType = 'paragraph'

    this.paragraphName = ''
    this.isRequiredParagraph = false

    this.listCheckBox = [];
    this.checkBoxName = '';
    this.isRequiredCheckBox = false;
    this.isAllowed = false;
    this.maxCheckBox = 0
  }

  private _validateValue(): boolean {
    var res = true;
    if (this.currentType == 'checkbox') {
      if (this.checkBoxName == '') {
        this.alertError('Question is required')
        return res = false;
      } else if (this.listCheckBox.length == 0) {
        this.alertError(`Checkbox list can't be empty`);
        return res = false;
      }
      else if (this.listCheckBox.length != 0) {
        for (let index = 0; index < this.listCheckBox.length; index++) {
          const element = this.listCheckBox[index];
          if (element == '') {
            this.alertError('Check box is required at least 1 character')
            return res = false
          }
        }
      }
    } else {
      if (this.paragraphName == '') {
        this.alertError('Question is required')
        return res = false
      }
    }
    return res
  }


  public addCheckBox() {
    if (this.maxCheckBox < 5) {
      this.listCheckBox.push('');
      this.maxCheckBox = this.maxCheckBox + 1
    } else {
      this.alertError(`Can only add 5 answer`)
    }
  }

  public removeCheckBox(index: number) {
    this.listCheckBox.splice(index, 1);
    this.maxCheckBox = this.maxCheckBox - 1
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  isRequired(event: any, type: QuestionType) {
    type == 'checkbox' ? this.isRequiredCheckBox = event.target.checked : this.isRequiredParagraph = event.target.checked
  }

  isAllow(event: any) {
    this.isAllowed = event.target.checked
  }

  alertSuccess() {
    this.toastr.success('Add question success');
  }

  alertError(item: string) {
    this.toastr.error(item);
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }

  public close(): void {
    if (this._validateValue()) {
      this._addQuestion();
      this._resetValue();
      this.alertSuccess();
      this.modalService.dismissAll();
    }
  }

}
