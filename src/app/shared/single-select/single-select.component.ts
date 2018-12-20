import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';

/**
 * 单选下拉框组合
 */
@Component({
  selector: 'app-single-select',
  templateUrl: './single-select.component.html',
  styleUrls: ['./single-select.component.scss']
})
export class SingleSelectComponent implements OnChanges {
  // 列表数据
  @Input() data;
  // 可选 对应列表数据的描述
  @Input() titleList = {};
  // 选中的值
  @Input() selected;
  // 选中值发生变化
  @Output() selectedChange = new EventEmitter<any>();
  // 水平显示的数量，默认为 4 个
  @Input() horizonNumber = 4;
  // 横向显示的列表
  list = [];
  // 下拉的列表
  listTwo = [];
  // 下拉列表是否显示标识
  dropShow = false;
  // 选中值是否为下拉列表中的值
  dropSelected = false;

  constructor() { }

  ngOnChanges(changes) {
    if (changes.data && changes.data.currentValue) {
      const dataClone = JSON.parse(JSON.stringify(this.data));
      if ((this.data.length - this.horizonNumber) > 1) {
        this.list = dataClone.splice(0, this.horizonNumber);
        this.listTwo = dataClone;
        this.dropShow = true;
        for (let i = 0; i < this.listTwo.length; i++) {
          if (this.listTwo[i].value === this.selected) {
            this.dropSelected = true;
            break;
          }
        }
      } else {
        this.list = dataClone;
        this.dropShow = false;
      }
    }
  }

  onSelectedChange(selected, isDrop) {
    this.selectedChange.emit(selected.value);
    if (isDrop) {
      this.dropSelected = true;
    } else {
      this.dropSelected = false;
    }
  }

}
