import {Component, Input, OnInit} from '@angular/core';
import {FormDataBase} from '../form-data-base';
import {FormGroup} from '@angular/forms';
import {FormControlService} from '../form-control.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  providers: [FormControlService]
})
export class DynamicFormComponent implements OnInit {
  @Input() data: FormDataBase[] = [];
  form: FormGroup;

  constructor(private fcs: FormControlService) { }

  ngOnInit() {
    this.form = this.fcs.toFormGroup(this.data);
  }

  ensure() {
    // console.log(this.data);
    // console.log(this.getResult());
  }

  getResult() {
    const data = JSON.parse(JSON.stringify(this.form.value));
    this.data.forEach((item) => {
      if (item.controlType === 'checkbox') {
        data[item.key] = item['options'].reduce((rs, option, i) => {
          if (data[item.key][i]) {
            rs.push(option.value);
          }
          return rs;
        }, []);
      }
    });
    return data;
  }
}
