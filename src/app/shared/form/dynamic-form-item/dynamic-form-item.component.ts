import {Component, Input} from '@angular/core';
import {FormDataBase, ValidatorMsg} from '../form-data-base';
import {FormGroup} from '@angular/forms';

/**
 * 表单元素
 */
@Component({
  selector: 'app-dynamic-form-item',
  templateUrl: './dynamic-form-item.component.html',
  styleUrls: ['./dynamic-form-item.component.scss']
})
export class DynamicFormItemComponent {
  static VALIDATOR_MSG: ValidatorMsg = {
    require: '必须填写！'
  };

  @Input() data: FormDataBase;
  @Input() form: FormGroup;
  get isPristine () {
    return this.form.controls[this.data.key].pristine;
  }
  get isValid() {
    return this.form.controls[this.data.key].valid;
  }
  get errors() {
    return this.form.controls[this.data.key].errors;
  }
  get requireMsg() {
    return this.data.validatorMsg.require || this.data.label + DynamicFormItemComponent.VALIDATOR_MSG.require;
  };
}
