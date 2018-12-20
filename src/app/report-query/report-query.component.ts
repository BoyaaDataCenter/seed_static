import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {GlobalDataService} from '../core/global-data.service';
const CompConfig = require('./../../assets/compConfig/compConfig');


@Component({
  selector: 'app-report-query',
  templateUrl: './report-query.component.html',
  styleUrls: ['./report-query.component.scss']
})
export class ReportQueryComponent implements OnInit {

  @Input() headerCompList;
  @Input() isGlobal = true;
  @Input() isCanSet = false;
  @Input() showAddBtn = false;
  @Input() pCid;
  @Input() panelQueryParam = {};
  @Output() queryChange = new EventEmitter<any>();
  @Output() deleteComp = new EventEmitter<any>();
  @Output() configChange = new EventEmitter<any>();
  @Output() selectedChange = new EventEmitter<any>();

  // 是否显示添加过滤条件弹窗
  dialogSqueryVisible = false;
  // 过滤组件列表
  compList = [];
  compListName = [];
  selectedIndex;
  pid;
  bid;

  constructor(private globalDataService: GlobalDataService) { }

  ngOnInit() {
    const temp_ = window.location.pathname.split('/');
    this.pid = parseInt(temp_[temp_.length - 1], 10);
    this.bid = parseInt(temp_[temp_.length - 2], 10);
    this.compList = CompConfig.config_.list[1].groupList;
    this.compList.forEach((item, index) => {
      this.compListName.push({'label': item.name, 'value': index});
    });
  }

  // 删除组件
  onDeleteComp(cid) {
    if (this.isGlobal) {
      if (this.headerCompList[cid].ename) {
        this.globalDataService.dealQueryParamsNum(0);
        this.globalDataService.deleteQueryParams({'type': this.isGlobal ? 'global' : 'panel', 'ename': this.headerCompList[cid].ename});
      }
      this.deleteComp.emit(cid);
    }else {
      this.deleteComp.emit(cid);
    }
  }

  // 下拉选择
  selectValue(event) {
    this.selectedIndex = event.value;
  }

  // 添加过滤条件
  addQueryComp () {
    this.dialogSqueryVisible = true;
  }

  // 关闭添加过滤条件按钮
  dialogHide() {
    this.dialogSqueryVisible = false;
  }

  // 保存添加
  save() {
    const type = this.compList[this.selectedIndex].type.split('_');
    // 日期插件逻辑处理
    if ( type[0] == 'flatpickr' ) {
      const timeType = type[1] == 'range' ? 2 : 1;
      this.headerCompList.push({'type': type[0], 'mode': type[1], 'timeType': timeType, 'otherTime': '', 'cascades': {},
        'sort': this.compList.length});
    }else if (type[0] == 'singleSelect' || type[0] == 'multiSelect' ) {
      this.headerCompList.push({'type': type[0], 'list': [], 'value': '', 'db': 0, 'sql': '', 'sourceType': 'dict',
        'cascades': {}, 'sort': this.compList.length});
    };

    this.dialogHide();
  }

  // 组件过略配置信息变化
  onConfigChange(data) {
    this.configChange.emit({'cid': data.cid, 'backUp': data.backUp, 'param': data.param});
  }

  // 组件选择值变化
  onSelectedChange(data) {
    this.selectedChange.emit(data);
  }
}
