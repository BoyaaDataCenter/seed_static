import { Injectable } from '@angular/core';
import {FormDataBase} from './form-data-base';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Injectable()
export class FormControlService {

  constructor(private fb: FormBuilder) { }

  toFormGroup(formData: FormDataBase[]) {
    const group: any = {};
    formData.forEach(data => {
      if (data.controlType === 'checkbox') {
        const controls = [];
        data['options'].forEach((option) => {
          controls.push(this.fb.control(!!~data.value.indexOf(option.value)));
        });
        group[data.key] = this.fb.array(controls);
      } else {
        if (data.require) {
          group[data.key] = new FormControl(data.value || '', Validators.required);
        } else {
          group[data.key] = new FormControl(data.value || '');
        }
      }
    });
    return new FormGroup(group);
  }
}
