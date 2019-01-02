import { Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {ChartService} from '../core/chart.service';
import {ReportElementService} from '../core/services/report-element.service';
import {GlobalDataService} from '../core/global-data.service';
const ReportConfig = require('./../../assets/compConfig/reportConfig');
const iziToast = require('izitoast');
declare var jQuery: any;
@Component({
  selector: 'app-report-element',
  templateUrl: './report-element.component.html',
  styleUrls: ['./report-element.component.scss']
})
export class ReportElementComponent implements OnInit, OnDestroy {

  // 一个报表元素的所有配置信息
  @Input() reportInfo;
  // 虚拟id
  @Input() cid;
  // 可选，表格数据的查询接口。
  @Input() tableDataUrl;
  // 可选，是否需要表格切换按钮，默认为 true
  @Input() hasToggle = true;
  // 可选（如果有图则为必传参数），图的相关配置，参见 core/chart.service.ts 的配置说明
  @Input() chartTypeConfig;
  // 可选，截取图的数据
  @Input() chartTopSeries: number;
  // 可选，趋势数据的相关配置，参考 data-table 该配置的说明
  @Input() trendConfig;
  // 可选，表格的默认显示行数，默认为 10 行
  @Input() tableRows = 10;
  // 可选，表格是否需要分页，默认为 true
  @Input() tablePaginator = true;
  // 可选，表格需要固定的字段，以字符串数组的形式传入需要固定的列字段 ['fieldName', 'fieldName2'....]
  @Input() tableFrozenFields = [];
  // 可选，表格渲染数据时不需要显示的字段，以字符串数组的形式传入不需要显示的列字段 ['fieldName', 'fieldName2'....]
  @Input() tableNotShowFields = [];
  // 可选，表格列的宽度，以对象形式传入 {fieldName: width }
  @Input() tableFieldsWidthConfig;
  // 可选，趋势数据的可选指标列表
  @Input() tableDimsList = [];
  // 可选，表格是否一屏显示
  @Input() tableOneScreenShow;
  // 可选，表格分组字段
  @Input() tableGroupField;
  // 是否显示添加过滤条件按钮
  @Input() isShowAddBtn;
  @Output() tableChange = new EventEmitter<any>();
  @Input() tableColumns;
  @Input() tableData;

  @Input() isCanSet = false;

  // 删除组件
  @Output() deletePanelComp = new EventEmitter<any>();
  // 配置变化
  @Output() configChange = new EventEmitter<any>();

  reportInfoTemp;
  // 默认显示图 or 表
  showChart;
  // 图的配置option;
  chartOption;
  chartData;
  // 当前显示的图类型
  curChartType;
  // 报表类型 cross for 横向, row for 纵向
  reportType;
  // 加载状态
  loading = false;
  errMsg;
  requestErr = false;
  // 是否显示弹窗
  dialogVisible = false;
  // jquery符号
  JQuery;
  // 业务数据库列表
  dbList = [];
  // 指标和维度列表
  dimList = [];
  // 指标和维度下拉选择
  typeList = [{'label': '指标', 'value': 'indexs'}, {'label': '维度', 'value': 'dimensions'}];
  // 是否百分比显示下拉选择
  rateList = [{'label': '否', 'value': false}, {'label': '是', 'value': true}];
  // 显示类型下拉
  showTypeList = [{'label': '线条', 'value': 'line'}, {'label': '柱状', 'value': 'bar'}, {'label': '面积', 'value': 'area'}];
  // y轴所在位置
  yAxisList = [{'label': '左边', 'value': 'left'}, {'label': '右边', 'value': 'right'}];
  // 排序方式
  sortList = [{'label': '默认', 'value': 'default'}, {'label': '升序', 'value': 'asc'}, {'label': '降序', 'value': 'desc'}];
  // 默认选择
  defaultSelectedList = [{'label': '是', 'value': true}, {'label': '否', 'value': false}];
  // 业务id
  bid;
  bodySize;
  panelQueryReady = false;
  panelQuery = {};
  // 报表请求的查询参数
  panelQueryParam = {};
  // 编辑SQL时可选择的报表过滤条件
  panelQueryList = [];
  noChange = true;
  rw;
  rh;
  // 是否已经配置数据源
  hasConfig = false;
  queryParam = {};
  // 通知组件刷新
  queryChange$;
  pid;

  globalQueryReady = false;
  globalQuery = {};
  // 编辑SQL时可选择的报表全局过滤条件
  globalQueryList = [];
  queryList = [];
  reportConfig;
  tips = '';
  showMenu: Boolean = false;
  showConfigTip: Boolean = false;

  indexsList = [];
  dimensionsList = [];

  // 报表可转换的类型
  chartChangeList = [];

  // 当前选择的指标（含具体参数，用户报表数据获取）
  currentIndexs = [];
  // 当前选择的维度（含具体参数，用户报表数据获取）
  currentDimensions = [];

  // 指标选择器的值
  indexsSelected = '';
  // 维度选择器的值
  dimSelected = [];
  // 维度限制的个数
  limitNum = 0;
  constructor(private chartService: ChartService, private reportElementService: ReportElementService,
              private globalDataService: GlobalDataService) {
    // 监听全局过滤条件加载完毕
    this.queryChange$ = globalDataService.queryChange$.subscribe((data) => {
      this.globalQueryReady = true;
      // 如果报表是已经配置来的报表，并且报表的局部过滤条件也加载完毕，则获取报表数据
      if (this.hasConfig && this.panelQueryReady) {
        this.getData(1);
      }
    });
  }

  ngOnInit() {
    const temp_ = window.location.pathname.split('/');
    this.pid = parseInt(temp_[temp_.length - 1], 10);
    this.bid = parseInt(temp_[temp_.length - 2], 10);
    this.JQuery = jQuery;

    // 获取报表配置
    this.reportConfig = ReportConfig.config_;

    // 报表可布局区域大小
    this.bodySize = {'width': this.JQuery('#chartBody').width(), 'height': window.innerHeight - 70};
    this.rw = this.reportInfo.w;
    this.rh = this.reportInfo.h;

    // 根据报表的id来判断是否显示“提示配置”文字图片
    this.showConfigTip = !(this.reportInfo.id && this.reportInfo.id > 0);

    const chartType = this.reportInfo.charttype.split('_');
    // 报表类型
    this.reportType = chartType[1] || (chartType[0] == 'bar' ? 'cross' : 'row');
    // 默认显示图或表
    this.showChart = (chartType[0] !== 'table');
    this.curChartType = chartType[0];
    // 图的基本配置
    this.chartTypeConfig = {
      base: chartType[0] == 'linestack' || chartType[0] == 'chart' ? 'line' : chartType[0],
      reverse: this.reportType !== 'row'
    };

    this.limitNum = this.reportConfig[this.curChartType]['dimensionsLimit'] || 0;

    this.reportInfoTemp = this.deepClone(this.reportInfo);

    // 通过是否配置了sql来标识该报表已配置（不能通过id，因为新建的报表在没有保存整个页面的时候是没有id的，这里通过sql在简单判断）
    this.hasConfig = this.reportInfoTemp.sql.length > 0;

    // 指标和维度列表
    this.dimList = [];
    this.reportInfoTemp.dimensions.forEach((item) => {
      this.dimList.push({'label': item.name, 'value': item.dimension, 'type': 'dimensions', 'rate': item.rate || false,
        'sort': item.sort || 'default', 'default': item.default || ''});
      this.dimensionsList.push({'label': item.name, 'value': item.dimension});
    });
    this.reportInfoTemp.indexs.forEach((item) => {
      this.dimList.push({'label': item.name, 'value': item.index, 'type': 'indexs', 'rate': item.rate,
        'show_type': item.show_type, 'yAxis': item.yAxis, 'sort': item.sort || 'default'});
      this.indexsList.push({'label': item.name, 'value': item.index});
    });

    // 获取报表配置里面的可转换类型
    this.chartChangeList = this.reportConfig[this.curChartType]['changeList'] || [];
    this.shouldGetData();
  }

  showMenuToggle() {
    this.showMenu = !this.showMenu;
  }

  // 切换图类型
  changeChartType(type) {
      this.curChartType = type;
      this.chartTypeConfig.base = type == 'linestack' ? 'line' : type;
      this.chartTypeConfig.reverse = type == 'bar';
      this.getData();
  }

  // 生成查询条件
  dealQueryParam() {
    let globalParam = this.globalDataService.getQueryParams('global');
    this.queryParam = {};
    Object.keys(globalParam).forEach((key) => {
      if (Object.prototype.toString.call(globalParam[key]['value']) == '[object Object]') {
        Object.keys(globalParam[key]['value']).forEach((key_) => {
          this.queryParam[key + '_' + key_] = globalParam[key]['value'][key_];
        });
      }else {
        this.queryParam[key] = globalParam[key]['value'];
      }
    });
    Object.keys(this.panelQueryParam).forEach((key) => {
      if (Object.prototype.toString.call(this.panelQueryParam[key]['value']) == '[object Object]') {
        Object.keys(this.panelQueryParam[key]['value']).forEach((key_) => {
          this.queryParam[key + '_' + key_] = this.panelQueryParam[key]['value'][key_];
        });
      }else {
        this.queryParam[key] = this.panelQueryParam[key]['value'];
      }
    });
  }

  // 获取数据
  getData(type?) {
    if (this.hasConfig && this.panelQueryReady && this.globalQueryReady || type) {
      this.dealQueryParam();
      this.requestErr = false;
      this.loadingShow();
      this.dimList = [];
      this.indexsList = [];
      this.dimensionsList = [];
      this.dimSelected = [];
      const chartType = this.reportInfo.charttype.split('_')[0];
      this.reportInfo.dimensions.forEach((item) => {
        this.dimList.push({'label': item.name, 'value': item.dimension, 'type': 'dimensions', 'rate': item.rate || false,
            'sort': item.sort || 'default', 'default': item.default || ''});
        if (chartType == 'linestack' && item.dimension == 'fdate') {  // 特殊处理fdate
          this.dimensionsList.push({'label': item.name, 'value': item.dimension, 'disabled': true});
        }else {
          this.dimensionsList.push({'label': item.name, 'value': item.dimension});
        }
      });
      this.reportInfo.indexs.forEach((item) => {
        // 折线图不需要指标选择器，但是有展示类型和多个y轴
        if (chartType == 'line') {
          this.dimList.push({'label': item.name, 'value': item.index, 'type': 'indexs', 'rate': item.rate,
            'show_type': item.show_type, 'yAxis': item.yAxis, 'sort': item.sort || 'default'});
        }else {
          this.dimList.push({'label': item.name, 'value': item.index, 'type': 'indexs', 'rate': item.rate, 'sort': item.sort || 'default'});
          this.indexsList.push({'label': item.name, 'value': item.index});
        }
      });
      let indexs;
      // 报表除折线图外，指标个数默认一个
      if (chartType == 'line') {
        indexs = [].concat(this.reportInfo.indexs);
      }else {
        indexs = [Object.assign({}, this.reportInfo.indexs[0])];
        this.indexsSelected = this.reportInfo.indexs[0].index;
      }
      this.currentIndexs = indexs;

      let dimensions = [];
      // 报表除对比趋势图外，维度个数默认一个，对比趋势图需要两个并且其中一个为fdate
      if (chartType == 'linestack') {
        this.reportInfo.dimensions.forEach((item) => {
          if (item.dimension == 'fdate') {
            dimensions.push(Object.assign({}, item));
            this.dimSelected.push(item.dimension);
          }else if (dimensions.length == 0 || (dimensions.length == 1 && dimensions[0].dimension == 'fdate') || item.default) {
            dimensions.push(Object.assign({}, item));
            this.dimSelected.push(item.dimension);
          }
        });
      }else {
        // 当图标时折线图并且切换到了table模式时，table表不需要维度选择器
        if (chartType == 'line' && this.curChartType == 'table') {
          dimensions = this.reportInfo.dimensions;
          this.dimSelected = [];
          this.dimensionsList = [];
        }else if (chartType == 'line') {  // 折线图默认选择一个维度
          this.dimSelected = [this.reportInfo.dimensions[0].dimension];
          dimensions = [Object.assign({}, this.reportInfo.dimensions[0])];
        }else {
          this.reportInfo.dimensions.forEach((item) => {
            if (item.default) {
              dimensions.push(Object.assign({}, item));
              this.dimSelected.push(item.dimension);
            }
          });
        }
      }
      this.currentDimensions = dimensions;
      let data = {
        'charttype': this.curChartType,
        'sql': this.reportInfo.sql,
        'indexs': indexs,
        'dimensions': dimensions,
        'query': this.queryParam,
        'db_source': this.reportInfo.db_source
      };
      this.reportElementService.getSqlData(data).subscribe((succData) => {
        if (this.showChart) {
          this.chartData = succData;
          this.setChartOption();
        }else {
          this.tableData = succData;
          this.setTableData();
        }
        this.loadingHide();
      });
    }
  }

  loadingShow() {
    this.errMsg = '';
    this.loading = true;
  }

  loadingHide() {
    this.loading = false;
  }

  // 获取图片的配置
  setChartOption() {
    this.chartOption = this.chartService.getChartOptionByType(this.chartTypeConfig, this.deepClone(this.chartData));
  }

  // 设置table表的配置
  setTableData() {
    const columns = [];
    const tableData = this.deepClone(this.tableData);
    if (tableData.displayName && tableData.displayName.length) {
      tableData.displayName.reduce((rs, item) => {
        let itemConfig;
        itemConfig = { header: item.displayName, field: item.name, sortable: true };
        if (this.tableFieldsWidthConfig && !this.isUndefined(this.tableFieldsWidthConfig[item.name])) {
          itemConfig['width'] = this.tableFieldsWidthConfig[item.name];
        }
        rs.push(itemConfig);
        return rs;
      }, columns);
      this.tableColumns = columns;
      this.tableData = tableData.data;
    } else {
      this.tableColumns = this.deepClone(this.tableColumns);
      this.tableData = tableData;
    }
    this.tableChange.next({
      data: this.tableData,
      columns: this.tableColumns
    });
  }

  deepClone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  isUndefined(val) {
    return typeof val === 'undefined';
  }

  // 切换图表
  toggle(type) {
    if (!this.hasConfig) {
      iziToast.error({
        position: 'topRight',
        title: '切换失败!',
        message: `请先点击配置按钮完成配置`,
      });
      return;
    }
    if (this.curChartType !== type) {
      this.showChart = (type !== 'table');
      // 返回报表的时候默认显示上次显示的图标类型，避免类型闪切
      this.curChartType = type;
      this.getData(1);
    }
  }

  // 配置数据源
  setDefault(event) {
    this.tips = (this.reportConfig[this.curChartType] && this.reportConfig[this.curChartType].tips) || '';
    this.globalQueryList = [];
    this.panelQueryList = [];
    this.globalQuery = this.globalDataService.getQueryParams('global');
    Object.keys(this.globalQuery).forEach((key) => {
      this.globalQueryList.push([key, this.globalQuery[key]['cname'], 'global']);
    });

    Object.keys(this.panelQuery).forEach((key) => {
      this.panelQueryList.push([key, this.panelQuery[key]['cname'], 'panel']);
    });
    this.queryList = [].concat(this.globalQueryList, this.panelQueryList);
    this.dimList = [];
    this.indexsList = [];
    this.dimensionsList = [];
    this.reportInfoTemp = this.deepClone(this.reportInfo);
    this.reportInfoTemp.dimensions.forEach((item) => {
      this.dimList.push({'label': item.name, 'value': item.dimension, 'type': 'dimensions', 'rate': item.rate || false,
        'sort': item.sort || 'default', 'default': item.default || ''});
      this.dimensionsList.push({'label': item.name, 'value': item.dimension});
    });
    this.reportInfoTemp.indexs.forEach((item) => {
      this.dimList.push({'label': item.name, 'value': item.index, 'type': 'indexs', 'rate': item.rate,
        'show_type': item.show_type, 'yAxis': item.yAxis, 'sort': item.sort || 'default'});
      this.indexsList.push({'label': item.name, 'value': item.index});
    });
    this.dbList = [];
    this.reportElementService.getBusinessDB(this.bid).subscribe((listData) => {
      listData.forEach((item) => {
        this.dbList.push({'label': item.name, 'value': item.id});
      });
      this.dialogShow();
    });
  }

  // 业务数据库变化
  onDbChange(target) {
    this.reportInfoTemp.db_source = target.value;
  }

  // 删除组件
  deleteComponent(event) {
    this.deletePanelComp.emit(this.cid);
    event.stopPropagation();
  }

  // 显示弹窗
  dialogShow() {
    this.dialogVisible = true;
  }

  // 关闭弹窗
  dialogHide() {
    this.dialogVisible = false;
  }

  // 根据sql申请指标和维度列表
  getSqlDim() {
    if (this.reportInfoTemp.sql.length == 0) {
      iziToast.error({
        position: 'topRight',
        title: '请求错误!',
        message: `请先配置SQL`,
      });
      return;
    }
    this.dimList = [];
    this.reportElementService.getSqlFields({'sqls': this.reportInfoTemp.sql}).subscribe((listData) => {
      listData.fields.forEach((item) => {
        this.dimList.push({'label': '', 'value': item, 'type': '', 'rate': false, 'show_type': '', 'yAxis' : '', 'default': ''});
      });
    });
  }

  // 点击级联选项
  clickQueryItem(key, type) {
    const index = this.JQuery('.reportDialogBody .sqlConfig')[0].selectionStart;
    const target = type == 'global' ? this.globalQuery[key] : this.panelQuery[key];
    if (target.compType == 'flatpickr') {
      this.reportInfoTemp.sql = this.reportInfoTemp.sql.slice(0, index) + ' ' + key
        + '>= {' + key + '_sdate} and ' + key + '<= {' + key + '_edate} ' + this.reportInfoTemp.sql.slice(index);
    }else if (target.compType == 'dropdown') {
      if (Object.prototype.toString.call(target.value) == '[object Array]') {
        this.reportInfoTemp.sql = this.reportInfoTemp.sql.slice(0, index) + key + ' in '
          + ' {' + key + '} ' + this.reportInfoTemp.sql.slice(index);
      }else {
        this.reportInfoTemp.sql = this.reportInfoTemp.sql.slice(0, index) + key +  ' = '
          + ' {' + key + '} ' + this.reportInfoTemp.sql.slice(index);
      }
    }
  }

  // 保存数据源配置
  save() {
    this.dealQueryParam();
    const chartType = this.reportInfo.charttype.split('_')[0];
    let data = {};
    data['charttype'] = chartType == 'chart' ? 'line' : chartType,
    data['db_source'] = this.reportInfoTemp.db_source;
    data['sql'] = this.reportInfoTemp.sql;
    data['query'] = this.queryParam;
    data['indexs'] = [];
    data['dimensions'] = [];
    this.reportInfoTemp['indexs'] = [];
    this.reportInfoTemp['dimensions'] = [];
    this.indexsList = [];
    this.dimensionsList = [];
    this.currentIndexs = [];
    this.currentDimensions = [];
    this.dimList.forEach((item) => {
        // 处理指标数据
        if (item.type == 'indexs') {
          // 指标的通用数据
          let dataTemp = {'index': item.value, 'name': item.label, 'rate': item.rate, 'sort': item.sort || 'default'};
          if (chartType == 'line') {
            // 如果报表是折线图，需要保存show_type和yAxis
            let dataTemp_ = Object.assign({}, {'show_type': item.show_type, 'yAxis' : item.yAxis}, dataTemp);
            // 折线图查询所有指标
            data['indexs'].push(dataTemp_);
            this.currentIndexs.push(dataTemp_);
            this.reportInfoTemp['indexs'].push(dataTemp_);
            // 折线图不需要指标选择器
            // this.indexsList.push(dataTemp_);
          }else {
            if ( data['indexs'].length == 0) {
              data['indexs'].push(dataTemp);
              this.currentIndexs.push(dataTemp);
            }
            this.indexsList.push({'label': item.label, 'value': item.value});
            this.reportInfoTemp['indexs'].push(dataTemp);
          }
        }else {
          let dataTemp = {'dimension': item.value, 'name': item.label, 'sort': item.sort || 'default', 'default': item.default || false};
          // 如果报表是对比趋势图
          if (chartType == 'linestack') {
            // 如果报表是对比趋势图，最少需要两个维度， 其中一个带fdate
            if (item.value == 'fdate') {
              data['dimensions'].push(dataTemp);
              this.currentDimensions.push(dataTemp);
            } else if (data['dimensions'].length == 0 || (data['dimensions'].length == 1 && data['dimensions'][0].dimension == 'fdate')
              || item.default) {
              data['dimensions'].push(dataTemp);
              this.currentDimensions.push(dataTemp);
            }
          }else if (chartType == 'line' && data['dimensions'].length == 0) {
            data['dimensions'].push(dataTemp);
            this.currentDimensions.push(dataTemp);
          }else {
            if (item.default) {
              this.currentDimensions.push(dataTemp);
            }
            data['dimensions'].push(dataTemp);
          }
          this.reportInfoTemp['dimensions'].push(dataTemp);
          this.dimensionsList.push({'label': item.label, 'value': item.value,
            'disabled': (chartType == 'linestack' && item.value == 'fdate') ? true : false});
        }
    });
    const reportConfig = this.reportConfig[this.curChartType];
    if (reportConfig) {
      if (this.dimList.length > reportConfig.totalNum) {
        iziToast.error({
          position: 'topRight',
          title: '保存失败!',
          message: `指标和维度个数不满足规定`,
        })
        return;
      }

      if (data['indexs'].length > reportConfig.indexsNum || data['indexs'].length == 0) {
        iziToast.error({
          position: 'topRight',
          title: '保存失败!',
          message: `指标个数不满足规定`,
        });
        return;
      }

      if (data['dimensions'].length > reportConfig.dimensionsNum || data['dimensions'].length == 0) {
        iziToast.error({
          position: 'topRight',
          title: '保存失败!',
          message: `维度个数不满足规定`,
        });
        return;
      }else {
        if (this.currentDimensions.length == 0) {
          iziToast.error({
            position: 'topRight',
            title: '保存失败!',
            message: `请至少选择一个默认展示的维度`,
          });
          return;
        }
      }
    }
    this.loadingShow();
    this.indexsSelected = this.currentIndexs[0] ? this.currentIndexs[0].index : '';
    this.dimSelected = [];
    this.currentDimensions.forEach((item) => {
      this.dimSelected.push(item.dimension);
    });
    this.reportElementService.getSqlData(data).subscribe((succData) => {
      this.showConfigTip = false;
      this.hasConfig = true;
      if (this.showChart) {
        this.chartData = succData;
        this.setChartOption();
      }else {
        this.tableData = succData;
        this.setTableData();
      }
      this.dialogHide();
      this.loadingHide();
      this.globalDataService.onCompChange({'isGlobal': false, 'type': 'chart', 'cid': this.cid, 'param': {'db_source': data['db_source'],
          'sql': data['sql'], 'indexs': this.reportInfoTemp['indexs'], 'dimensions': this.reportInfoTemp['dimensions'],
          'name': this.reportInfoTemp.name, 'desc': this.reportInfoTemp.desc}});
    });
  }

  // 编辑图表大小
  resizable(e) {
    let mouseX = e.clientX;
    let mouseY = e.clientY;
    let editArea = jQuery(e.target).parents('.content');
    let itWidth = editArea.width();
    let itHeight = editArea.height();
    let that_ = this;
    let hasNotice;
    jQuery('#chartBody').on('mousemove', function( event ){
      that_.noChange = false;
      let changeX = event.clientX - mouseX;
      let changeY = event.clientY - mouseY;
      hasNotice = false;
      editArea.css({
        'width': ((itWidth + changeX) > 300 ? (itWidth + changeX) : 300) + 'px',
        'height': ((itHeight + changeY) > 150 ? (itHeight + changeY) : 150) + 'px',
      });

      document.onmouseup = function(){
        jQuery('#chartBody').off();
        if (!hasNotice) {
          hasNotice = true;
          const target = that_.JQuery('.main .reoprt-element-panel_' + that_.cid);
          that_.rw = ((target.width() + 4) / that_.bodySize.width * 100).toFixed(2);
          that_.rh = ((target.height() - 60) / that_.bodySize.height * 100).toFixed(2);
          that_.reportInfo.w = +that_.rw > 100 ? 100 : +that_.rw;
          that_.reportInfo.h = +that_.rh;
          setTimeout(() => {that_.noChange = true; editArea.css({'height': 'auto'}); editArea = null; }, 20);
        }
      };
    });
  }

  // 删除过滤组件
  onDeleteComp(cid) {
    delete this.panelQueryParam[this.reportInfo.filters[cid]['ename']];
    delete this.panelQuery[this.reportInfo.filters[cid]['ename']];
    if (this.reportInfo.filters[cid]['ename']) {
      this.reportInfo.filters[cid]['status'] = -1;
    }else {
      this.reportInfo.filters.splice(cid, 1);
    }
    this.shouldGetData();
  }

  // 判断是否全部过滤条件加载完毕，是则加载数据
  shouldGetData() {
    let filters = 0;
    for ( let i = 0; i < this.reportInfo.filters.length; i++ ) {
      if ( this.reportInfo.filters[i].status != -1) {
        filters++;
      }
    }
    if (Object.keys(this.panelQueryParam).length >= filters) {
      this.panelQueryReady = true;
      this.getData();
    }else {
      this.panelQueryReady = false;
    }
  }

  // 报表选择条件配置改变
  onConfigChange(data) {
    this.configChange.emit({cid: this.cid, data: data});
  }

  // 局部查询条件值变化
  onSelectedChange(data) {
    // 如果该组件更换了ename，则删除旧的ename，添加新的ename
    if (data.backUp && data.backUp.length > 0) {
        delete this.panelQueryParam[data.backUp];
        delete this.panelQuery[data.backUp];
    }
    // 储存局部查询条件的值
    this.panelQueryParam[data.ename] = data['data'];
    this.panelQuery[data.ename] = data['data'];
    // 如果是级联组件，且是父组件，则不需要加载报表数据，等子组件加载就好
    if (!data.child) {
      this.shouldGetData();
    }
  }

  // 报表的指标或者维度组合变化
  echartSelectChange(data) {
    let indexs = [], dimensions = [];
    if (data.type == 'indexs') {
      // 指标变化，则维度使用上一次的值
      dimensions = this.currentDimensions;
      // 存储当前指标的值
      this.indexsSelected = data.value;
      this.reportInfoTemp.indexs.forEach((item) => {
        if (item.index == data.value) {
          indexs.push(item);
          this.currentIndexs = indexs;
        }
      });
    }else {
      indexs = this.currentIndexs;
      this.dimSelected = data.value;
      this.reportInfoTemp.dimensions.forEach((item) => {
        if (data.value.indexOf(item.dimension) > -1) {
          dimensions.push(item);
        }
      });
      /*if (dimensions.length < this.reportConfig[this.curChartType]['dimensionsLimit']) {
        iziToast.error({
          position: 'topRight',
          title: '维度选择错误!',
          message: `请至少选择${this.reportConfig[this.curChartType]['dimensionsLimit']}个维度`,
        });
        return false;
      }*/
      this.currentDimensions = dimensions;
    }
    this.loadingShow();
    let dataObject = {
      'charttype': this.curChartType,
      'sql': this.reportInfo.sql,
      'indexs': indexs,
      'dimensions': dimensions,
      'query': this.queryParam,
      'db_source': this.reportInfo.db_source
    };
    this.reportElementService.getSqlData(dataObject).subscribe((succData) => {
      if (this.showChart) {
        this.chartData = succData;
        this.setChartOption();
      }else {
        this.tableData = succData;
        this.setTableData();
      }
      this.loadingHide();
    });
  }

  // 表格的维度变化
  tableDimChange(data) {
    this.loadingShow();
    let dataObject = {
      'charttype': this.curChartType,
      'sql': this.reportInfo.sql,
      'indexs': this.currentIndexs,
      'dimensions': this.currentDimensions,
      'vth_columns': data,
      'query': this.queryParam,
      'db_source': this.reportInfo.db_source
    };
    this.reportElementService.getSqlData(dataObject).subscribe((succData) => {
      if (this.showChart) {
        this.chartData = succData;
        this.setChartOption();
      }else {
        this.tableData = succData;
        this.setTableData();
      }
      this.loadingHide();
    });
  }

  ngOnDestroy() {
    if (this.queryChange$) {
      this.queryChange$.unsubscribe();
    }
  }
}
