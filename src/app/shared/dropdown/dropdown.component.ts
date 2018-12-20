import {Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit, OnDestroy} from '@angular/core';
import {DropdownService} from './dropdown.service';
import {GlobalDataService} from './../../core/global-data.service';
import {QueryDataService} from './../../core/query-data.service';
const iziToast = require('izitoast');
declare var jQuery: any;
@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [DropdownService]
})
export class DropdownComponent implements OnInit, OnDestroy {

  // 组件类型
  @Input() compType = 'singleSelect';
  // 组件名称
  @Input() title;
  // 列表数据
  @Input() optionsList;
  // 选中的值
  @Input() selectedOption;
  // 数据库源
  @Input() db;
  // 数据库源
  @Input() sql;
  // 是否是配置页面
  @Input() isCanSet: Boolean = false;
  // 组件排列ID
  @Input() cid;
  // 组件真实ID
  @Input() id;
  // 报表ID
  @Input() pCid
  // 下拉数据的来源
  @Input() sourceType;
  // 组件cname
  @Input() cname;
  // 组件ename
  @Input() ename;
  // 储存级联关系
  @Input() cascades;
  // 全局组件
  @Input() globalComp: Boolean = true;
  // 模块组件参数
  @Input() panelQueryParam = {};

  // 选中值发生变化
  @Output() selectedChange = new EventEmitter<any>();

  // 删除组件
  @Output() deleteComp = new EventEmitter<any>();

  // 配置发生变化
  @Output() configChange = new EventEmitter<any>();

  dbSource;
  sqlSource;
  dbList = [];
  dialogVisible: Boolean = false;
  optionsListTemp;
  JQuery;
  // 是否需要加载组件下拉数据
  shouldLoadData: Boolean = false;
  // 标记是否多选的值变化
  isMultiValueChange: Boolean = false;
  cnameTemp;
  isNew: Boolean = false;
  queryParam = [];
  // 组件的所有查询条件，当为global时，与panelQueryParam一致，否则则相当于panelQueryParam加上全局查询条件
  queryParamData = {};
  // 储存级联关系
  // cascades = {'parent': []};

  // 组件标识的备份字段
  enameTemp;

  // 监听过滤组件值变化
  queryChange$;
  // 监听是否被设置为级联父组件
  setQueryChild$;
  // 监听是有其子组件被删除
  deleteQuery$;

  cascadesValue;

  queryData;

  constructor(private dropdownService: DropdownService, private globalDataService: GlobalDataService,
              private queryDataService: QueryDataService) {
    this.queryChange$ = queryDataService.queryChange$.subscribe((data) => {
      if ((data.type == 'global' || (data.type == 'panel' && data.pCid == this.pCid)) && data.ename == this.cascades.parent[0]) {
        if (this.shouldLoadData) {
          this.getData();
        }
      }
    });
    this.setQueryChild$ = this.queryDataService.setQueryChild$.subscribe((data) => {
      if ((data.cascadesType == 'global' || (data.type == 'panel' && data.pCid == this.pCid)) && data.key == this.ename) {
        this.cascades['child'] = [data.ename];
      }
    });

    this.deleteQuery$ = this.queryDataService.deleteQuery$.subscribe((data) => {
      if (this.cascades && this.cascades['child'] &&  this.cascades['child'][0] == data) {
        this.cascades['child'] = [];
      }
    });
  }

  ngOnInit() {
    this.cnameTemp = this.cname;
    this.enameTemp = this.ename;
    this.JQuery = jQuery;
    this.dbSource = this.db;
    this.sqlSource = this.sql;
    this.shouldLoadData = this.id ? true : false;
    this.isNew = this.ename == '';
    if (!this.cascades || !this.cascades['parent']) {
      this.cascades = {};
      this.cascades['parent'] = [];
    }
    if (this.shouldLoadData && this.cascades.parent && this.cascades.parent.length == 0) {
      this.getData();
    }else {
      this.optionsList = [];
      this.optionsListTemp = [];
      this.selectedOption = this.compType == 'singleSelect' ? '' : [];
    }
  }

  getData() {
    this.checkCascades();
    let data = {};
    if (Object.prototype.toString.call(this.cascadesValue) == '[object Object]') {
      data = this.cascadesValue;
    }else {
      data[this.cascades['parent'][0]] = this.cascadesValue;
    }
    // 已保存的，有了id
    if (this.id) {
      this.dropdownService.getListDataById(this.id, this.cascades['parent'].length > 0 ? {'query': data} : {}).subscribe((listData) => {
        this.dealResult(listData);
      });
    }else {  // 没有保存的，只能根据sql去查询
      this.queryData['query'] = data;
      this.dropdownService.getListDataByParam(this.queryData).subscribe((listData) => {
        this.dealResult(listData);
      });
    }
  }

  dealResult(listData) {
    this.optionsList = listData.conditions || [];
    this.optionsListTemp = [].concat(this.optionsList);
    if (this.optionsList.length > 0) {
      this.selectedOption = this.compType == 'singleSelect' ? this.optionsList[0].value : [this.optionsList[0].value];
    }else {
      this.selectedOption = this.compType == 'singleSelect' ? '' : [];
    }
    if (this.globalComp) {
      let data = {'type': 'global',
        'ename': this.ename, 'data': {'cid': this.cid, 'cname': this.cname, 'value': this.selectedOption, 'compType': 'dropdown'}};
      if (this.cascades && this.cascades.child && this.cascades.child.length > 0) {
        // data['child'] = true; 全局过滤条件不需要这个限制
        this.globalDataService.setQueryParams(data);
      }else {
        this.globalDataService.setQueryParams(data);
      }
    }else {
      let data = {'ename': this.ename, 'data': {'cid': this.cid, 'cname': this.cname,
          'value': this.selectedOption, 'compType': 'dropdown'}};
      if (this.cascades && this.cascades.child && this.cascades.child.length > 0) {
        data['child'] = true;
        this.selectedChange.emit(data);
      }else {
        this.selectedChange.emit(data);
      }
    }
    this.queryDataService.onQueryChange({'ename': this.ename, 'pCid': this.pCid, 'type': this.globalComp ? 'global' : 'panel',
      'value': this.selectedOption});
  }

  onSelectedChange(event) {
    this.selectedOption = event.value;
    if (this.globalComp) {
      let data = {'type': 'global',
        'ename': this.ename, 'data': {'cid': this.cid, 'cname': this.cname, 'value': this.selectedOption, 'compType': 'dropdown'}};
      if (this.cascades && this.cascades.child && this.cascades.child.length > 0) {
        data['child'] = true;
        this.globalDataService.setQueryParams(data);
      }else {
        this.globalDataService.setQueryParams(data);
      }
    }else {
      let data = {'ename': this.ename, 'data': {'cid': this.cid, 'cname': this.cname,
          'value': this.selectedOption, 'compType': 'dropdown'}};
      if (this.cascades && this.cascades.child && this.cascades.child.length > 0) {
        data['child'] = true;
        this.selectedChange.emit(data);
      }else {
        this.selectedChange.emit(data);
      }
    }
    this.queryDataService.onQueryChange({'ename': this.ename, 'pCid': this.pCid, 'type': this.globalComp ? 'global' : 'panel',
      'value': this.selectedOption});
  }

  onMultiSelectedChange(event) {
    this.isMultiValueChange = true;
  }

  panelHide() {
    if (this.isMultiValueChange) {
      this.isMultiValueChange = false;
      if (this.globalComp) {
        let data = {'type': 'global',
          'ename': this.ename, 'data': {'cid': this.cid, 'cname': this.cname, 'value': this.selectedOption, 'compType': 'dropdown'}};
        if (this.cascades && this.cascades.child && this.cascades.child.length > 0) {
          data['child'] = true;
          this.globalDataService.setQueryParams(data);
        }else {
          this.globalDataService.setQueryParams(data);
        }
      } else {
        let data = {'ename': this.ename, 'data': {'cid': this.cid, 'cname': this.cname,
            'value': this.selectedOption, 'compType': 'dropdown'}};
        if (this.cascades && this.cascades.child && this.cascades.child.length > 0) {
          data['child'] = true;
          this.selectedChange.emit(data);
        }else {
          this.selectedChange.emit(data);
        }
      }
      this.queryDataService.onQueryChange({'ename': this.ename, 'pCid': this.pCid, 'type': this.globalComp ? 'global' : 'panel',
        'value': this.selectedOption});
    }
  }

  // 配置数据源
  setDefault(event) {
    if (this.optionsListTemp.length == 0) {
      this.optionsListTemp.push({label: '', value: ''});
    }
    this.dbList = [];
    const temp_ = window.location.pathname.split('/');
    const bid = parseInt(temp_[2], 10);
    this.dropdownService.getBusinessDB(bid).subscribe((listData) => {
      listData.forEach((item) => {
        this.dbList.push({'label': item.name, 'value': item.id});
      });
      this.queryParam = [];
      if (this.globalComp) {
        this.queryParamData = this.panelQueryParam;
      }else {
        this.queryParamData = Object.assign({}, this.globalDataService.getQueryParams('global'), this.panelQueryParam);
      }
      Object.keys(this.queryParamData).forEach((key) => {
        if (key != this.ename) {
          this.queryParam.push([key, this.queryParamData[key]['cname']]);
        }
      });
      this.enameTemp = this.ename;
      this.dialogVisible = true;
    });
  }

  // 删除组件
  deleteComponent(event) {
    if (this.cascades && this.cascades.child && this.cascades.child.length > 0) {
      iziToast.error({
        position: 'topRight',
        title: '删除失败!',
        message: `请先删除其级联的子组件`,
      });
      return false;
    }else {
      this.queryDataService.onDeleteQuery(this.ename);
      this.deleteComp.emit(this.cid);
      event.stopPropagation();
    }

  }

  // 业务数据库变化
  onDbChange(event) {
    this.dbSource = event.value;
  }

  // 关闭弹窗
  dialogHide() {
    this.dialogVisible = false;
  }

  // 保存数据源配置
  save() {
    if (this.sourceType == 'dict') {
      if (this.optionsListTemp.length == 0 || !this.ename || !this.cname) {
        iziToast.error({
          position: 'topRight',
          title: '配置错误!',
          message: `各参数不能为空`,
        });
        return false;
      }
    }else if (this.sourceType == 'sql') {
      if (!this.dbSource || !this.sqlSource || !this.ename || !this.cname) {
        iziToast.error({
          position: 'topRight',
          title: '配置错误!',
          message: `各参数不能为空`,
        });
        return false;
      }
    }
    if (this.isNew) {
      this.isNew = false;
      this.globalDataService.dealQueryParamsNum(1);
    }
    this.checkCascades();
    if (this.globalComp) {
      this.globalDataService.onCompChange({'isGlobal': this.globalComp, 'type': 'dropdown', 'cid': this.cid,
        'backUp': this.enameTemp == this.ename ? '' : this.enameTemp, 'param': {'db': this.dbSource, 'sql': this.sqlSource,
          'list': this.optionsListTemp, 'cname': this.cname, 'ename': this.ename, 'sourceType': this.sourceType, 'id': this.id,
          'cascades': this.cascades}});
    }else {
      this.configChange.emit({'type': 'dropdown', 'cid': this.cid, 'backUp': this.enameTemp == this.ename ? '' : this.enameTemp,
        'param': {'db': this.dbSource, 'sql': this.sqlSource, 'list': this.optionsListTemp, 'cname': this.cname, 'ename': this.ename,
          'sourceType': this.sourceType, 'id': this.id, 'cascades': this.cascades}});
    }
    // 获取过滤组件数据
    let data = {};
    if (Object.prototype.toString.call(this.cascadesValue) == '[object Object]') {
      data = this.cascadesValue;
    }else {
      data[this.cascades['parent'][0]] = this.cascadesValue;
    }
    this.queryData = {'condition_type': this.sourceType, 'conditions':  this.sourceType == 'sql' ? this.sqlSource :
        this.optionsListTemp, 'db_source': this.dbSource, 'query': this.cascades.parent.length > 0 ? data : {}};
    this.dropdownService.getListDataByParam(this.queryData).subscribe((listData) => {
      this.optionsList = listData.conditions || [];
      this.optionsListTemp = [].concat(this.optionsList);
      if (this.optionsList.length > 0) {
        this.selectedOption = this.compType == 'singleSelect' ? this.optionsList[0].value : [this.optionsList[0].value];
      }else {
        this.selectedOption = this.compType == 'singleSelect' ? '' : [];
      }
      this.cnameTemp = this.cname;
      if (this.globalComp) {
        this.globalDataService.setQueryParams({'type': 'global', 'backUp': this.enameTemp == this.ename ? '' : this.enameTemp,
          'ename': this.ename, 'data': {'cid': this.cid, 'cname': this.cname, 'value': this.selectedOption, 'compType': 'dropdown'}});
      }else {
        this.selectedChange.emit({'ename': this.ename, 'backUp': this.enameTemp == this.ename ? '' : this.enameTemp,
          'data': {'cid': this.cid, 'cname': this.cname, 'value': this.selectedOption, 'compType': 'dropdown'}});
      }
      this.queryDataService.onQueryChange({'ename': this.ename, 'pCid': this.pCid, 'type': this.globalComp ? 'global' : 'panel',
        'value': this.selectedOption});
      this.dialogHide();
      this.shouldLoadData = true;
    });

  }

  // 添加选项
  configAdd(i) {
    let item = {
      label: '',
      value: ''
    }
    this.optionsListTemp.push(item);
  }

  // 删除选项
  configDelete(i) {
    if (this.optionsListTemp.length >= 1) {
      this.optionsListTemp.splice(i, 1);
    }
  }

  selectQuery(key) {
    this.checkCascades();
    if (this.cascades.parent.length >= 1) {
      iziToast.error({
        position: 'topRight',
        title: '添加失败!',
        message: `该过滤组件已有级联的父组件`,
      });
      return false;
    }
    const index = this.JQuery('.dropdownDialogBody .sqlConfig')[0].selectionStart;
    const target = this.queryParamData[key];
    if (target.compType == 'flatpickr') {
      this.sqlSource = this.sqlSource.slice(0, index) + ' ' + key
        + '>= {' + key + '_sdate} and ' + key + '<= {' + key + '_edate} ' + this.sqlSource.slice(index);
    }else if (target.compType == 'dropdown') {
      if (Object.prototype.toString.call(target.value) == '[object Array]') {
        this.sqlSource = this.sqlSource.slice(0, index) + key + ' in '
          + ' {' + key + '} ' + this.sqlSource.slice(index);
      }else {
        this.sqlSource = this.sqlSource.slice(0, index) + key +  ' = '
          + ' {' + key + '} ' + this.sqlSource.slice(index);
      }
    }
  }

  checkCascades() {
    let data;
    const panelQuery = this.panelQueryParam;
    const globalQuery = this.globalDataService.getQueryParams('global');
    if (this.globalComp) {
      data = globalQuery;
    }else {
      data = Object.assign({}, globalQuery, panelQuery);
    }
    this.cascades.parent = [];
    Object.keys(data).forEach((key) => {
      let pattern, dateFlag;
      if (Object.prototype.toString.call(data[key]['value']) == '[object Object]') {
        pattern = new RegExp( '\\{{1}' + key + '_sdate' + '{1,}\\}');
        dateFlag = true;
      }else {
        pattern = new RegExp( '\\{{1}' + key + '{1,}\\}');
        dateFlag = false;
      }

      if (this.sqlSource.match(pattern)) {
        this.cascades.parent[0] = key;
        if (dateFlag) {
          const valueTemp = {};
          valueTemp[key + '_sdate'] = data[key]['value']['sdate'];
          valueTemp[key + '_edate'] = data[key]['value']['edate'];
          this.cascadesValue = valueTemp;
        }else {
          this.cascadesValue = data[key].value;
        }
        // type字段是旧字段，为了兼容旧数据   cascadesType为级联的组件类型（全局或者局部）
        this.queryDataService.onSetQueryChild({'ename': this.ename, 'pCid': this.pCid, 'type': this.globalComp ? 'global' : 'panel',
          'cascadesType': panelQuery[key] ? 'panel' : 'global', 'key': key});
      }
    });
  }

  ngOnDestroy() {
    if (this.queryChange$) {
      this.queryChange$.unsubscribe();
    }
    if (this.setQueryChild$) {
      this.setQueryChild$.unsubscribe();
    }
  }
}
