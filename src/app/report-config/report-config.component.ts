import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import {ReportConfigService} from '../core/services/report-config.service';
import {GlobalDataService} from '../core/global-data.service';
import {Router} from '@angular/router';
const iziToast = require('izitoast');
const CompConfig = require('./../../assets/compConfig/compConfig');
import {ConfirmationService} from '../primeng/components/common/api';

declare var Sortable: any;
declare var jQuery: any;
@Component({
  selector: 'app-report-config',
  templateUrl: './report-config.component.html',
  styleUrls: ['./report-config.component.scss']
})
export class ReportConfigComponent implements OnInit, AfterViewInit, OnDestroy {

  sortable: any;
  compList = [];

  headerCompList = [];
  panelCompList = [];
  pid;
  bid;
  // 检测是否需要更新组件配置
  compChange$;
  // 检测全局过滤组件的值是否变化
  queryChange$
  // 全局的过滤组件以及值
  globalQueryParam;


  constructor(private reportConfigService: ReportConfigService, private router: Router, private globalDataService: GlobalDataService,
              private confirmationService: ConfirmationService) {
    // 组件配置变化
    this.compChange$ = globalDataService.compChange$.subscribe((data) => {
      if (data.isGlobal) {
        Object.keys(data.param).forEach((key) => {
          this.headerCompList[data['cid']][key] = data.param[key];
        });
      }else {
        Object.keys(data.param).forEach((key) => {
          this.panelCompList[data['cid']][key] = data.param[key];
        });
      }
    });

    // 全局查询条件的值变化
    this.queryChange$ = globalDataService.queryChange$.subscribe((data) => {
      this.globalQueryParam = globalDataService.getQueryParams('global');
    });
  }

  ngOnInit() {
    // 清除缓存的查询条件
    this.globalDataService.resetQueryParams();
    const temp_ = window.location.pathname.split('/');
    this.pid = parseInt(temp_[temp_.length - 1], 10);
    this.bid = parseInt(temp_[temp_.length - 2], 10);
    const userRole = this.globalDataService.getParams().userInfo;
    // 如果是普通用户，没有权限操作这个页面
    if (userRole.role == 'user') {
      this.goBack(0);
      return false;
    }
    // 左侧的组件列表
    this.compList = CompConfig.config_.list;
    // 设置第一个分类为展开状态
    this.compList.forEach( (item, index) => {
      item['active'] = index == 0;
    });
    this.getData();
  }

  // 获取页面的报表数据
  getData() {
    this.headerCompList = [];
    this.panelCompList = [];
    this.reportConfigService.getPageData(this.pid).subscribe((succData) => {
      // 处理报表数据，将后端字段转化为前端需要的字段
      succData.panels.forEach((item) => {
        let data;
        item.filters.forEach((item_, index) => {
          if (item_.stype == 'flatpickr') {
            data = {'type': 'flatpickr', 'mode': item_.condition_type, 'timeType': item_.conditions.split('_')[0] || 2,
              'otherTime': item_.conditions.split('_')[1] || '', 'id': item_.id, 'cname': item_.cname, 'ename': item_.ename,
            'cascades': item_.cascades};
          }else if (item_.stype == 'singleSelect' || item_.stype == 'multiSelect') {
            data = { 'id': item_.id, 'type': item_.stype, 'cname': item_.cname, 'ename': item_.ename, 'sourceType': item_.condition_type,
              'list': item_.condition_type == 'dict' ? item_.conditions : [], 'cascades': item_.cascades,
              'db': item_.db_source || '', 'sql': item_.condition_type == 'dict' ? '' : item_.conditions};
          }
          item.filters[index] = data;
        });
      });
      this.panelCompList = succData.panels;

      // 处理全局查询组件数据
      succData.global_filters.forEach((item) => {
        let data;
        if (item.stype == 'flatpickr') {
          data = {'type': 'flatpickr', 'mode': item.condition_type, 'timeType': item.conditions.split('_')[0] || 2,
            'otherTime': item.conditions.split('_')[1] || '', 'id': item.id, 'cname': item.cname, 'ename': item.ename,
            'cascades': item.cascades};
        }else if (item.stype == 'singleSelect' || item.stype == 'multiSelect') {
          data = { 'id': item.id, 'type': item.stype, 'cname': item.cname, 'ename': item.ename, 'sourceType': item.condition_type,
            'list': item.condition_type == 'dict' ? item.conditions : [], 'cascades': item.cascades,
            'db': item.db_source || '', 'sql': item.condition_type == 'dict' ? '' : item.conditions};
        }
        this.headerCompList.push(data);
      });

      // 设置全局查询条件数量
      this.globalDataService.setQueryParamsNum(this.headerCompList.length);
    });
  }

  // 初始化拖拽
  initSortable() {
    let that_ = this;
    // 图标列表
    new Sortable( document.getElementById('chartList'), {
      group: {'name': 'chart', pull: 'clone', put: false},
      handle: '.item',
      sort: false,
      ghostClass: 'drag',
      chosenClass: 'test',
    });

    // 图表填充区域
    this.sortable = new Sortable(document.getElementById('chartBody'), {
      group: {'name': 'chart', pull: false, put: true},
      sort: true,
      handle: '.handleHeader',
      animation: 150,
      scroll: true,
      onAdd: function (evt) {
        const type = jQuery(evt.item).attr('_type');
        const data = {'bussiness_id': that_.bid, 'charttype': type, 'dimensions': [], 'filters': [], 'h': 30, 'indexs': [],
          'page_id': that_.pid, 'sql': '', 'w': 48.2, 'x': 0, 'y': 0, 'name': '', 'desc': '', 'db_source': 0,
          'sort': that_.panelCompList.length, 'cascades': {}};
        that_.panelCompList.push(data);
        jQuery(evt.item).remove();
      },
      onUpdate: function (evt) {
        that_.panelCompList[evt.newIndex]['sort'] = evt.oldIndex;
        that_.panelCompList[evt.oldIndex]['sort'] = evt.newIndex;
      }
    });

    // 筛选列表
    new Sortable(document.getElementById('queryList'), {
      group: {'name': 'query', pull: 'clone', put: false},
      handle: '.item',
      sort: false,
    });

    // 筛选填充区域
    new Sortable(document.getElementById('queryBody'), {
      group: {'name': 'query', pull: false, put: true},
      sort: false,
      animation: 150,
      // filter: '.bud-overlay',
      scroll: true,
      onAdd: function (/**Event*/evt) {
        const type = jQuery(evt.item).attr('_type').split('_');

        // 全局日期插件逻辑处理
        if ( type[0] == 'flatpickr' ) {
          const timeType = type[1] == 'range' ? 2 : 1;
          that_.headerCompList.push({'type': type[0], 'mode': type[1], 'timeType': timeType, 'otherTime': '', 'cascades': {},
            'sort': that_.headerCompList.length});
        }else if (type[0] == 'singleSelect' || type[0] == 'multiSelect' ) {
          that_.headerCompList.push({'type': type[0], 'list': [], 'value': '', 'db': 0, 'sql': '', 'sourceType': 'dict', 'cascades': {},
            'sort': that_.headerCompList.length});
        };
        jQuery(evt.item).remove();
      }
    });
  }

  // 保存页面数据
  savePage() {
    // 储存全局组件参数
    let temp = [];
    const headerCompList_ = [].concat(this.headerCompList);
    const panelCompList_ = [].concat(this.panelCompList);
    // 处理全局组件
    headerCompList_.forEach((item) => {
      const temp_ = item.type.split('_');
      let compData;
      // 处理全局日期组件数据
      if (temp_[0] == 'flatpickr') {
        compData = {'bussiness_id': this.bid, 'page_id': this.pid, 'stype': item.type, 'condition_type': item.mode,
          'conditions': item.timeType + '_' + item.otherTime, 'ename': item.ename, 'cname': item.cname,
          'dtype': 'page', 'cascades': item.cascades};
      }else if (temp_[0] == 'singleSelect' || temp_[0] == 'multiSelect') {
        compData = {'bussiness_id': this.bid, 'page_id': this.pid, 'stype': temp_[0], 'condition_type': item.sourceType,
          'conditions': item.sourceType == 'sql' ? item.sql : item.list, 'ename': item.ename, 'cname': item.cname,
          'dtype': 'page', 'cascades': item.cascades};
        item['sourceType'] == 'sql' ? compData['db_source'] = item.db : 0;
      }
      if (item.id) {
        compData['id'] = item.id;
      }

      // 删除的标志
      if (item.status == -1) {
        compData['status'] = -1;
      }
      temp.push(compData);
    });
    panelCompList_.forEach((item) => {
      let filtersData = [];
      item.filters.forEach((item_) => {
        const temp_ = item_.type.split('_');
        let compData;
        // 处理全局日期组件数据
        if (temp_[0] == 'flatpickr') {
          compData = {'bussiness_id': this.bid, 'page_id': this.pid, 'stype': item_.type, 'condition_type': item_.mode,
            'conditions': item_.timeType + '_' + item_.otherTime, 'ename': item_.ename, 'cname': item_.cname,
            'dtype': 'model', 'cascades': item_.cascades};
        }else if (temp_[0] == 'singleSelect' || temp_[0] == 'multiSelect') {
          compData = {'bussiness_id': this.bid, 'page_id': this.pid, 'stype': temp_[0], 'condition_type': item_.sourceType,
            'conditions': item_.sourceType == 'sql' ? item_.sql : item_.list, 'ename': item_.ename, 'cname': item_.cname,
            'dtype': 'model', 'cascades': item_.cascades};
          item_['sourceType'] == 'sql' ? compData['db_source'] = item_.db : 0;
        }
        if (item_.id) {
          compData['id'] = item_.id;
        }
        // 删除的标志
        if (item_.status == -1) {
          compData['status'] = -1;
        }
        filtersData.push(compData);
      });
      delete item.filters_;
      item.filters = filtersData;
    });
    this.reportConfigService.savePageData(this.pid, {'global_filters': temp, 'panels': panelCompList_}).subscribe((succData) => {
      iziToast.success({
        position: 'topRight',
        title: '请求成功!',
        message: `页面数据保存成功`,
      });
      this.getData();
    }, (error) => {
      iziToast.error({
        position: 'topRight',
        title: '保存失败!',
        message: `请重新配置并确保报表和组件的配置正确`,
      });
      this.getData();
    });
  }

  // 退出编辑页
  goBack(type?) {
    if (type === 0) {
      this.router.navigateByUrl('/reportPage/' + this.bid + '/' + this.pid);
    }else {
      this.confirmationService.confirm({
        message: `退出前请确保修改的内容已保存~`,
        accept : () => {
          this.router.navigateByUrl('/reportPage/' + this.bid + '/' + this.pid);
        }
      });
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // 初始化拖拽
      this.initSortable();
    }, 20);
  }

  // 菜单的切换
  targetList(index) {
    this.compList.forEach((item, i) => {
      item.active = index == i;
    });
  }

  // 删除组件
  onDeleteComp(cid) {
    if (this.headerCompList[cid].id) {
      this.headerCompList[cid]['status'] = -1;
    }else {
      this.headerCompList.splice(cid, 1);
    }
  }

  // 删除报表
  onDeletePanelComp(cid) {
    if (this.panelCompList[cid].id) {
      this.panelCompList[cid]['status'] = -1;
      console.log('this.panelCompList[cid][\'status\']', this.panelCompList[cid]['status']);
    }else {
      this.panelCompList.splice(cid, 1);
    }
  }

  // 过滤组件配置变化
  onConfigChange(data) {
    let target = this.panelCompList[data.cid]['filters'][data.data.cid];
    Object.keys(data.data.param).forEach((key) => {
      target[key]  = data.data.param[key];
    });
  }

  ngOnDestroy() {
    this.globalDataService.resetQueryParams();
    if (this.compChange$) {
      this.compChange$.unsubscribe();
    }
    if (this.queryChange$) {
      this.queryChange$.unsubscribe();
    }
  }
}
