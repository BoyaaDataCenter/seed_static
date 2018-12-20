import {Component, ViewChild, AfterViewInit, Output, EventEmitter, Input, OnChanges,
  HostListener, OnInit , OnDestroy} from '@angular/core';
import {Util} from '../util';
import {GlobalDataService} from '../../core/global-data.service';
import {QueryDataService} from './../../core/query-data.service';
const Flatpickr = require('flatpickr');
const Zh = require('flatpickr/dist/l10n/zh.js').zh;
const iziToast = require('izitoast');
declare var jQuery: any;
/**
 * flatpickr 封装
 */
@Component({
  selector: 'app-flatpickr',
  templateUrl: './flatpickr.component.html',
  styleUrls: ['./flatpickr.component.scss']
})
export class FlatpickrComponent implements AfterViewInit, OnChanges, OnDestroy, OnInit {

  // 日期插件的模式
  @Input() mode: 'single'|'multiple'|'range' = 'single';
  // 是否为全局
  @Input() isGlobal: Boolean = true;
  // 是否为可配置模式
  @Input() isCanSet: Boolean = false;
  // 日期插件的宽度
  @Input() width: 'auto';
  // 日期当前值
  @Input() date;
  // 日期值发生变化
  @Output() dateChange = new EventEmitter<any>();
  // flatpickr 日期组件初始化文本框
  @ViewChild('flatpickr') flatpickrInput;
  // 英文标识
  @Input() ename;
  // 中文标识
  @Input() cname;
  // 中文标识
  @Input() timeType: Number = 2;
  // 时间段类型值发生变化
  @Output() timeTypeChange = new EventEmitter<any>();
  // 删除组件
  @Output() deleteComp = new EventEmitter<any>();
  // 组件ID
  @Input() cid;
  // 真实ID
  @Input() id;
  // 报表ID
  @Input() pCid;
  // 储存级联关系
  @Input() cascades;
  // 自定义时间
  @Input() otherTime: any;
  // 是否是全局组件
  @Input() globalComp: Boolean = true;
  // 配置发生变化
  @Output() configChange = new EventEmitter<any>();
  // 选中值发生变化
  @Output() selectedChange = new EventEmitter<any>();

  timeList = [
    { label: '昨天', value:  1 },
    { label: '最近7天', value:  2 },
    { label: '最近15天', value: 3 },
    { label: '最近30天', value: 4 },
    { label: '本月', value: 5 },
    { label: '上月', value: 6 }
  ];

  // 存储 flatpickr 实例
  canlendar;
  // 是否显示
  showStatus = true;
  // 快捷选项列表
  shortcutList;
  selfClick;

  inputDate = {
    sdate: '',
    edate: ''
  };

  dialogVisible = false;
  singleDialogVisible = false;

  JQuery;

  isChange: Boolean = false;

  isFirstInit: Boolean = false;

  isNew: Boolean = false;

  // 组件标识的备份字段
  enameTemp;

  hasConfig = false;

  // 监听是否被设置为级联父组件
  setQueryChild$;
  //
  // queryChange$;

  constructor(private globalDataService: GlobalDataService, private queryDataService: QueryDataService) {
    // this.queryChange$ = queryDataService.queryChange$.subscribe((data) => {
    //   console.log('data----------=======', data, this.ename);
    //
    // });
    this.setQueryChild$ = this.queryDataService.setQueryChild$.subscribe((data) => {
      if ((data.type == 'global' || (data.type == 'panel' && data.pCid == this.pCid)) && data.key == this.ename) {
        this.cascades['child'] = [data.ename];
      }
    });
  }

  setOption() {
    if (this.canlendar) {
      this.canlendar.setDate(this.date, false);
      this.setShortActive();
    }
  }

  ngOnInit() {
    this.JQuery = jQuery;
    this.enameTemp = this.ename;
    this.showStatus = false;
    if (!this.cascades || !this.cascades['parent']) {
      this.cascades = {};
      this.cascades['parent'] = [];
    }
    this.setShortcut();
  }

  ngAfterViewInit() {
    this.canlendar = new Flatpickr(this.flatpickrInput.nativeElement, {
      locale: Zh,
      mode: this.mode,
      maxDate: new Date(),
      inline: true,
      onChange: (selectedDates) => {
        if (this.mode === 'range') {
          if (selectedDates.length === 2) {
            this.date = selectedDates;
            this.setShortActive();
            this.setInputDate();
          }
        } else {
          if (selectedDates.length === 1) {
            this.date = selectedDates[0];
            this.isChange = true;
            this.hide();
          }
        }
        if (this.isFirstInit) {
          this.isChange = true;
        }else {
          if (this.ename) {
            const date_ = this.mode === 'range' ? {'sdate': this.getFormatDate(selectedDates[0]),
                'edate': this.getFormatDate(selectedDates[1]) } : {'sdate': this.getFormatDate(selectedDates[0]),
              'edate': this.getFormatDate(selectedDates[0]) };
            if (this.globalComp) {
              this.globalDataService.setQueryParams({'type': 'global',
                'ename': this.ename, 'data': {'cid': this.cid, 'cname': this.cname, 'value': date_, 'compType': 'flatpickr'}});
            }else {
              let data = {'ename': this.ename, 'data': {'cid': this.cid, 'cname': this.cname,
                  'value': date_, 'compType': 'flatpickr'}};
              if (this.cascades && this.cascades.child && this.cascades.child.length > 0) {
                data['child'] = true;
                this.selectedChange.emit(data);
              }else {
                this.selectedChange.emit(data);
              }
            }
            this.queryDataService.onQueryChange({'ename': this.ename, 'pCid': this.pCid, 'type': this.globalComp ? 'global' : 'panel',
              'value': date_});
          }
        }
        this.isFirstInit = true;
      }
    });
    this.isNew = this.ename == '';
    if (this.mode != 'range') {
      this.date = new Date(Date.now() - 1000 * 60 * 60 * 24);
      this.canlendar.setDate(this.date);
      this.setShortActive();
      this.setInputDate();
      const date_ = {'sdate': this.getFormatDate(this.date[0]), 'edate': this.getFormatDate(this.date[0]) };
      setTimeout(() => {
        this.queryDataService.onQueryChange({'ename': this.ename, 'pCid': this.pCid, 'type': this.globalComp ? 'global' : 'panel',
          'value': date_});
      }, 20);
    }else {
      this.date = this.getPassDay(new Date(Date.now() - 1000 * 60 * 60 * 24), 6);
      this.save(0);
    }
  }

  ngOnChanges(changes) {
    if (changes.date) {
      const currentValue = changes.date.currentValue;
      const previousValue = changes.date.previousValue;
      if (currentValue) {
        if (currentValue.length) {
          // todo 多日期下从外部更新的判断逻辑
        } else {
          if (
            previousValue &&
            currentValue instanceof Date &&
            previousValue instanceof Date &&
            currentValue.setHours(0, 0, 0, 0) !== previousValue.setHours(0, 0, 0, 0)
          ) {
            this.setOption();
          }
        }
      }
    }
  }

  setShortcut() {
    const today = new Date(Date.now() - 1000 * 60 * 60 * 24);
    const year = today.getFullYear();
    const month = today.getMonth();

    let pastMonth;
    let pYear = year;
    let pMonth = month;
    if (pMonth === 0) {
      pMonth = 12;
      pYear = year - 1;
    } else {
      pMonth = month - 1;
    }
    pastMonth = [new Date(pYear, pMonth, 1), new Date(year, month, 0)];

    this.shortcutList = [
      { label: '昨天', value:  this.getPassDay(today, 0) },
      { label: '最近7天', value:  this.getPassDay(today, 6), active: true },
      { label: '最近15天', value: this.getPassDay(today, 14) },
      { label: '最近30天', value: this.getPassDay(today, 29) },
      { label: '本月', value: [new Date(year, month, 1), today] },
      { label: '上月', value: pastMonth }
    ];
  }

  setShortActive() {
    if (this.mode === 'range') {
      this.shortcutList.map((item) => {
        item['active'] = this.dateIsEqual(this.date[0], item['value'][0]) &&
          this.dateIsEqual(this.date[1], item['value'][1]);
        return item;
      });
    }
  }

  getPassDay(today, day) {
    return [new Date(today.getTime() - day * 1000 * 60 * 60 * 24), today];
  }

  dateIsEqual(a, b) {
    return a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }

  setInputDate () {
    if (this.mode === 'range') {
      this.inputDate.sdate = Util.getDateStr(this.date[0]);
      this.inputDate.edate = Util.getDateStr(this.date[1]);
    }
  }

  inputDateEnsure() {
    const sdate = this.inputDate.sdate;
    const edate = this.inputDate.edate;

    const reg = /20\d{2}\-[0,1]?\d{1}\-[0-3]?\d{1}/;

    if (!reg.test(sdate.trim()) || !reg.test(edate.trim())) {
      this.setInputDate();
      return;
    }

    const sArray = sdate.split('-').map(v => parseInt(v, 10));
    const eArray = edate.split('-').map(v => parseInt(v, 10));
    let sT = new Date(sArray[0], sArray[1] - 1, sArray[2]).getTime();
    let eT = new Date(eArray[0], eArray[1] - 1, eArray[2]).getTime();
    const todayT = new Date().setHours(0, 0, 0);

    if (eT > todayT) {
      eT = todayT;
    }

    if (sT > eT) {
      sT = eT;
    }

    this.canlendar.setDate([new Date(sT), new Date(eT)]);

    if (this.ename) {
      const date_ = this.mode === 'range' ? {'sdate': this.getFormatDate(new Date(sT)), 'edate': this.getFormatDate(new Date(eT)) } :
        {'sdate': this.getFormatDate(new Date(sT)), 'edate': this.getFormatDate(new Date(sT)) };
      if (this.globalComp) {
        this.globalDataService.setQueryParams({'type': 'global',
          'ename': this.ename, 'data': {'cid': this.cid, 'cname': this.cname, 'value': date_, 'compType': 'flatpickr'}});

      }else {
        let data = {'ename': this.ename, 'data': {'cid': this.cid, 'cname': this.cname,
            'value': date_, 'compType': 'flatpickr'}};
        if (this.cascades && this.cascades.child && this.cascades.child.length > 0) {
          data['child'] = true;
          this.selectedChange.emit(data);
        }else {
          this.selectedChange.emit(data);
        }
      }
      this.queryDataService.onQueryChange({'ename': this.ename, 'pCid': this.pCid, 'type': this.globalComp ? 'global' : 'panel',
        'value': date_});
    }
    setTimeout(() => {this.showStatus = false;} , 20);
    // this.hide();
  }


  show() {
    this.selfClick = true;
    if (!this.showStatus) {
      this.showStatus = true;
    }
  }

  hide() {
    if (this.isChange && this.showStatus || this.isNew || this.hasConfig) {
      this.showStatus = false;
      this.hasConfig = false;
      this.setShortActive();
      this.setInputDate();
      this.isChange = false;
      if (this.ename) {
        const date_ = this.mode === 'range' ? {'sdate': this.getFormatDate(this.date[0]), 'edate': this.getFormatDate(this.date[1]) } :
          {'sdate': this.getFormatDate(this.date), 'edate': this.getFormatDate(this.date) };
        if (this.globalComp) {
          this.globalDataService.setQueryParams({'type': 'global', 'backUp': this.enameTemp == this.ename ? '' : this.enameTemp,
            'ename': this.ename, 'data': {'cid': this.cid, 'cname': this.cname, 'value': date_, 'compType': 'flatpickr'}});
        }else {
          let data = {'ename': this.ename, 'backUp': this.enameTemp == this.ename ? '' : this.enameTemp,
            'data': {'cid': this.cid, 'cname': this.cname, 'value': date_, 'compType': 'flatpickr'}};
          if (this.cascades && this.cascades.child && this.cascades.child.length > 0) {
            data['child'] = true;
            this.selectedChange.emit(data);
          }else {
            this.selectedChange.emit(data);
          }
        }
        this.queryDataService.onQueryChange({'ename': this.ename, 'pCid': this.pCid, 'type': this.globalComp ? 'global' : 'panel',
          'value': date_});
      }
    }else {
      this.showStatus = false;
    }
  }

  ngOnDestroy() {
    this.showStatus = false;
    this.canlendar.destroy();
    if (this.setQueryChild$) {
      this.setQueryChild$.unsubscribe();
    }
    // if (this.queryChange$) {
    //   this.queryChange$.unsubscribe();
    // }
  }

  shortcutClick(val) {
    this.date = val;
    this.canlendar.setDate(this.date);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev): void {
    if (!this.selfClick) {
      this.hide();
    }
    this.selfClick = false;
  }

  setDefaultTime(event) {
    this.enameTemp = this.ename;
    if (this.mode === 'range' ) {
      this.dialogVisible = true;
    }else {
      this.singleDialogVisible = true;
    }
    event.stopPropagation();
  }

  dialogHide() {
    this.dialogVisible = false;
    this.singleDialogVisible = false;
  }

  save(type) {

    if (this.timeType == 100 && this.otherTime.length == 0 && type == 1) {
      iziToast.error({
        position: 'topRight',
        title: '保存失败!',
        message: `请填写自定义天数`,
      });
      return ;
    }

    if ((!this.ename || !this.cname) && type != 0) {
      iziToast.error({
        position: 'topRight',
        title: '保存失败!',
        message: `请填写cname或者ename`,
      });
      return ;
    }

    if (type != 2) {
      let selectedTime;
      const today = new Date(Date.now() - 1000 * 60 * 60 * 24);
      const year = today.getFullYear();
      const month = today.getMonth();

      let pastMonth;
      let pYear = year;
      let pMonth = month;
      if (pMonth === 0) {
        pMonth = 12;
        pYear = year - 1;
      } else {
        pMonth = month - 1;
      }
      pastMonth = [new Date(pYear, pMonth, 1), new Date(year, month, 0)];


      if (this.timeType == 100) {
        selectedTime = this.getPassDay(today,  parseInt(this.otherTime, 10) - 1);
      }else if (this.timeType == 1) {
        selectedTime = this.getPassDay(today, 0);
      }else if (this.timeType == 2) {
        selectedTime = this.getPassDay(today, 6);
      }else if (this.timeType == 3) {
        selectedTime = this.getPassDay(today, 14);
      }else if (this.timeType == 4) {
        selectedTime = this.getPassDay(today, 29);
      }else if (this.timeType == 5) {
        selectedTime = [new Date(year, month, 1), today];
      }else if (this.timeType == 6) {
        selectedTime = pastMonth;
      }
      this.date = selectedTime;
      this.canlendar.setDate(this.date);
      this.setShortActive();
      this.setInputDate();
      if (type == 1) {
        this.dialogHide();
        const date_ = this.mode === 'range' ? {'sdate': this.getFormatDate(this.date[0]), 'edate': this.getFormatDate(this.date[1]) } :
          {'sdate': this.getFormatDate(this.date[0]), 'edate': this.getFormatDate(this.date[0]) };
          if (this.globalComp) {
            if (this.isNew) {
              this.globalDataService.dealQueryParamsNum(1);
              this.isNew = false;
            }
            this.globalDataService.setQueryParams({'type': 'global', 'backUp': this.enameTemp == this.ename ? '' : this.enameTemp,
              'ename': this.ename, 'data': {'cid': this.cid, 'cname': this.cname, 'value': date_, 'compType': 'flatpickr'}});
            this.globalDataService.onCompChange({'isGlobal': this.globalComp, 'type': 'flatpickr', 'cid': this.cid,
              'backUp': this.enameTemp == this.ename ? '' : this.enameTemp,
              'param': {'ename': this.ename, 'cname': this.cname, 'timeType': this.timeType, 'otherTime': this.otherTime}});
        }else {
          this.configChange.emit({'cid': this.cid, 'backUp': this.enameTemp == this.ename ? '' : this.enameTemp,
            'param': { 'cname': this.cname, 'ename': this.ename, 'timeType': this.timeType, 'otherTime': this.otherTime, 'id': this.id}});

        }
        this.queryDataService.onQueryChange({'ename': this.ename, 'pCid': this.pCid, 'type': this.globalComp ? 'global' : 'panel',
          'value': date_});
      }else {
        const date_ = this.mode === 'range' ? {'sdate': this.getFormatDate(this.date[0]),
          'edate': this.getFormatDate(this.date[1]) } : {'sdate': this.getFormatDate(this.date[0]),
          'edate': this.getFormatDate(this.date[0]) };
        setTimeout(() => {
          this.queryDataService.onQueryChange({'ename': this.ename, 'pCid': this.pCid, 'type': this.globalComp ? 'global' : 'panel',
            'value': date_});
        }, 20);

      }
    }else if (type == 2) {
      this.date = new Date(Date.now() - 1000 * 60 * 60 * 24);
      this.canlendar.setDate(this.date);
      this.setShortActive();
      this.setInputDate();
      this.dialogHide();
      const date_ = this.mode === 'range' ? {'sdate': this.getFormatDate(this.date[0]), 'edate': this.getFormatDate(this.date[1]) } :
        {'sdate': this.getFormatDate(this.date), 'edate': this.getFormatDate(this.date) };
      if (this.globalComp) {
        if (this.isNew) {
          this.globalDataService.dealQueryParamsNum(1);
          this.isNew = false;
        }
        this.globalDataService.setQueryParams({'type': 'global', 'backUp': this.enameTemp == this.ename ? '' : this.enameTemp,
          'ename': this.ename, 'data': {'cid': this.cid, 'cname': this.cname, 'value': date_, 'compType': 'flatpickr'}});
        this.globalDataService.onCompChange({'isGlobal': this.globalComp, 'type': 'flatpickr', 'cid': this.cid,
          'backUp': this.enameTemp == this.ename ? '' : this.enameTemp,
          'param': {'ename': this.ename, 'cname': this.cname}});
      }else {
        this.configChange.emit({'cid': this.cid, 'backUp': this.enameTemp == this.ename ? '' : this.enameTemp,
          'param': { 'cname': this.cname, 'ename': this.ename, 'id': this.id}});
      }
      this.queryDataService.onQueryChange({'ename': this.ename, 'pCid': this.pCid, 'type': this.globalComp ? 'global' : 'panel',
        'value': date_});
    }

    this.hasConfig = type == 0 ? false : true;
  }

  deleteComponent(event) {
    this.deleteComp.emit(this.cid);
    event.stopPropagation();
  }

  getFormatDate(time) {
    let date = new Date(time);
    let seperator = '-';
    let year: any = date.getFullYear();
    let month: any = date.getMonth() + 1;
    let strDate: any = date.getDate();
    if (month >= 1 && month <= 9) {
      month = '0' + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate;
    }
    let currentdate = year + seperator + month + seperator + strDate;
    return currentdate;
  }
}
