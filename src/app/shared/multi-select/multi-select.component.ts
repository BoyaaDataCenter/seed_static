import {Component, OnInit, ViewChild, Output, Input, EventEmitter, OnChanges} from '@angular/core';

/**
 * 多选下拉框
 */
@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit, OnChanges {
  @ViewChild('op') overlayPanel;
  // 选中数据
  @Input() selected; // 以 , 分隔的选中数值
  // 标题
  @Input() title = '指标选择';
  // 选中数据发生变化
  @Output() selectedChange = new EventEmitter<any>();
  // 原始列表数据
  @Input() data = [];
  // 展示的列表数据
  list;
  // 全选按钮数据
  selectedValue = true;
  search;

  constructor() { }

  ngOnInit() {}

  setSelected() {
    const st = this.selected ? this.selected.split('|') : [];
    let count = 0;
    if (this.data) {
      const oriList = this.data;
      for (let i = 0; i < oriList.length; i++) {
        oriList[i]['selected'] = false;
        for (let j = 0; j < st.length; j++) {
          if (st[j] === oriList[i]['ename']) {
            oriList[i]['selected'] = true;
            count = count + 1;
            break;
          }
        }
      }
      if (count === oriList.length) {
        this.selectedValue = true;
      } else {
        this.selectedValue = false;
      }
      this.list = this.deepClone(this.data);
    }
  }

  ngOnChanges(changes) {
    if (changes.selected && changes.selected.currentValue) {
      this.setSelected();
    }
  }

  /**
   * 全选值变化
   * @param val
   */
  allSelectedChange(val) {
    this.list.map((item) => {
      if (item['_isFilter']) {
        item['selected'] = val;
      } else {
        item['selected'] = false;
      }
      return item;
    });
    this.selectedValue = val;
  }

  /**
   * 切换选中状态
   */
  toggleState(item) {
    item['selected'] = !item['selected'];
  }

  /**
   * 隐藏前
   */
  onBeforeHide() {
    this.search = '';
    this.setSelected();
  }

  /**
   * 搜索关键字改变
   * @param val
   */
  searchChange(val) {
    this.search = val;
    this.allSelectedChange(false);
  }

  /**
   * 确认
   */
  ensure() {
    const result = this.list.reduce((rs, item) => {
       if (item.selected) {
         if (rs === '') {
           rs += item.ename;
         } else {
           rs += '|' + item.ename;
         }
       }
       return rs;
    }, '');
    this.selectedChange.emit(result);
    this.overlayPanel.hide();
  }

  /**
   * 取消
   */
  cancel() {
    this.overlayPanel.hide();
  }

  /**
   * 深度克隆
   * @param source
   * @returns {any}
   */
  deepClone(source) {
    return JSON.parse(JSON.stringify(source));
  }
}
