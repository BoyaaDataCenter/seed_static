import {Component, Input} from '@angular/core';

/**
 * 加载
 */
@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  @Input() loading: boolean;
  @Input() msg: string;

  constructor() { }
}
