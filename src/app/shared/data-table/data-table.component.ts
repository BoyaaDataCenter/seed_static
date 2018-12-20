import {
  Component, OnInit, Input, OnChanges, HostListener, ViewChild, Output, EventEmitter, ElementRef,
  AfterViewInit
} from '@angular/core';
// import {TrendDialogService} from '../../core/trend-dialog/trend-dialog.service';
import {Util} from '../util';
import {ConfigService} from '../../core/services/config.service';
import {GlobalDataService} from '../../core/global-data.service';
import {Router} from '@angular/router';
// import {RemarkService} from '../../core/services/remark.service';

/**
 * 基础表格组件
 */
@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnChanges, AfterViewInit {
  myDataTable;
  @ViewChild('myDataTable') set content(content) {
    this.myDataTable = content;
  }

  /**
   * ## 表格的列表数据
   * 以对象列表的形式传入，除去数据相关的字段外，可添加以下额外的字段,用于特殊的导出需求处理：
   * ```javascript
   * {
   *  // 可选，该行数据是否需要删除按钮，默认为 false
   *  _hasDelete: {boolean},
   *  // 可选，该行数据是否改为左对齐, 默认为 false （即对齐方式为右对齐）
   *  _alignLeft: {boolean}
   * }
   * ```
   */
  @Input() data;

  /**
   * ## 表格列的配置信息
   * 以对象数组 [ column1Config, column2Config...] 的形式传入, 可配置的参数如下:
   * ```javascript
   * {
   *   // 必须，列的头部显示文字
   *   header: {string},
   *   // 必须，列的取值字段
   *   filed: {string},
   *   // 可选，列是否需要排序，默认为 false
   *   sortable: {boolean}
   *   // 可选，列是否需要固定，默认为 false
   *   frozen: {boolean},
   *   // 可选，列的宽度
   *   width: {number}
   * }
   * ```
   */
  @Input() columns;

  /**
   * ## 趋势配置
   * 只要传入该配置对象，渲染的数据每一行都会带上可点击的趋势图标。
   * 配置参数如下：
   * ```javascript
   * {
   *  // 可选，获取趋势数据的接口（因为项目前期不同的趋势数据对应不同的接口，而后期统一改为从一个接口取数据）
   *  url: {string},
   *  // 可选，查询趋势数据时日期的默认，默认为 'range' 即双日期
   *  mode: {'single' | 'range'},
   *  // 可选，符合 Util.analysisQuery 函数解析规则的参数
   *  query: {object},
   *  // 可选，是否自动传入趋势的指标列表，默认为 false ,
   *  //      如果设置为 true, 将传入 this.dimList 作为趋势的指标列表数据
   *  autoDims: {boolean},
   *  // 可选，趋势标题生成的字段列表，配置后将会在点击的行数据上取出所配置的字段值组合起来
   *  titleFields: [{string}...]
   * }
   * ```
   */
  @Input() trendConfig;

  /**
   * ## 链接配置
   * 因为目前只有大厅概况模块有跳转链接的需求，所以没有参数传入进行个性化配置
   * ```javascript
   * {
   *  base: {boolean}
   * }
   * ```
   */
  @Input() linkConfig;

  // 查询参数，从外部传入获取表格数据时的查询参数对象
  @Input() query;
  // 指标列表，该指标列表将在详情数据中使用
  @Input() dimsList;
  // 数据默认显示的行数，默认为10条
  @Input() rows = 10;
  // 导出 CSV 文件的名称
  @Input() exportFilename = '默认导出文件名称';
  // 表格最大的垂直高度，默认没有最大高度
  @Input() scrollHeight = 'auto';
  // 是否一屏显示数据，即数据不分页且数据不会出现横向和纵向滚动条，默认为 false
  @Input() oneScreenShow = false;
  // 数据分组的字段，默认为空
  @Input() groupField: string;
  // 是否需要分页组件，默认为 true
  @Input() paginator = true;

  // 数据是否需要编辑按钮，默认为 false
  @Input() hasEdit = false;
  // 数据是否需要详情按钮，默认为 false
  @Input() hasDetail = false;
  // 数据是否需要详情按钮，默认为 false
  @Input() hasDelete = false;

  // 维度列表
  @Input() dimList = [];
  @Input() dimSelected = [];

  // 点击编辑按钮事件
  @Output() onRowEdit = new EventEmitter<any>();
  // 点击详情按钮事件
  @Output() onRowDetail = new EventEmitter<any>();
  // 点击删除按钮事件
  @Output() onRowDelete = new EventEmitter<any>();

  // 图表指标维度变化
  @Output() selectChange: EventEmitter<any> = new EventEmitter<any>();
  // 根据维度展开图表
  @Output() tableDimChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() limitNum = 0;

  // 是否有趋势按钮
  hasOperate = false;
  // 是否有链接按钮
  hasLink = false;

  // 内容区宽度
  contentWidth;
  // 固定区域宽度
  frozenWidth;
  // 非固定区域宽度
  unfrozenWidth;
  // 每列宽度
  columnWidth;
  // 是否有横向滚动条
  scrollXAble = false;
  // 是否有纵向滚动条
  scrollYAble = false;
  // 操作列是否固定
  otherFrozen = true;

  // 初始化状态
  viewInit = false;

  // 已选的按维度展开的数据
  tableDim = [];

  tableDimValue = [];

  _data = [];
  _columns;

  constructor(
    // private remarkService: RemarkService,
    private router: Router,
    private configService: ConfigService,
    private globalDataService: GlobalDataService,
    // private trendDialogService: TrendDialogService,
    private host: ElementRef,
  ) {}

  ngOnChanges(changes) {
    if (changes.columns && changes.columns.currentValue && this.viewInit) {
      this.setTableSizeInfo();
    }
  }

  ngOnInit() {
    if (this.trendConfig) {
      this.hasOperate = true;
    }
    if (this.linkConfig && this.linkConfig.base) {
      this.hasLink = true;
    }

    this.tableDim = [];
    this.dimList.forEach((item) => {
      if (this.dimSelected.indexOf(item.value) > -1) {
        this.tableDim.push({'label': item.label, 'value': item.value});
      }
    });
    this.tableDimValue = [];
  }

  ngAfterViewInit() {
    this.contentWidth = this.host.nativeElement.parentElement.clientWidth;
    if (this.columns && this.columns.length) {
      this.setTableSizeInfo();
    }
    this.viewInit = true;
  }

  /**
   * 设置表格大小相关的信息
   */
  setTableSizeInfo() {
    const COLUMN_WIDTH = 150; // 普通的列宽
    const OPERATE_WIDTH = 50; // 操作列宽
    let frozenWidth = 0;
    let countWidth = 0;
    const columns = JSON.parse(JSON.stringify(this.columns));
    if (this.hasOperate || this.hasLink || this.hasEdit || this.hasDelete) {
      frozenWidth += OPERATE_WIDTH;
      countWidth += OPERATE_WIDTH;
    }
    columns.forEach((item) => {
      if (typeof item.width !== 'undefined') {
        countWidth += item.width;
        if (item.frozen) {
          frozenWidth += item.width;
        }
      } else {
        countWidth += COLUMN_WIDTH;
        if (item.frozen) {
          frozenWidth += COLUMN_WIDTH;
        }
      }
    });
    if (countWidth > this.contentWidth && !this.oneScreenShow) {
      this.otherFrozen = true;
      this.frozenWidth = frozenWidth;
      this.unfrozenWidth = this.contentWidth - frozenWidth;
      this.columnWidth = COLUMN_WIDTH;
      this.scrollXAble = true;
    } else {
      this.otherFrozen = false;
      this.frozenWidth = 0;
      this.unfrozenWidth = this.contentWidth;
      columns.map((item) => item['frozen'] = false);
      this.scrollXAble = false;
    }
    if (this.scrollHeight && this.scrollHeight !== 'auto') {
      this.scrollYAble = true;
    } else {
      this.scrollYAble = false;
    }
    this._data = this.data;
    this._columns = columns;
  }

  /**
   * 窗口变化，重新渲染数据
   * @param ev
   */
  @HostListener('window:resize', ['$event'])
  onWindowResize(ev) {
    const curtWidth = this.host.nativeElement.parentElement.clientWidth;
    if (this.contentWidth !== curtWidth) {
      this.contentWidth = curtWidth;
      if (this.data) {
        this.setTableSizeInfo();
      }
    }
  }

  /**
   * 显示趋势数据
   * @param row
   */
  showTrend(row) {

    // 展开表格的查询参数到 query 中，方便使用 analysisQuery 拿 query.query 中的值
    const query = this.query;
    if (query && query.query) {
      Object.keys(query.query).forEach((key) => {
        query[key] = query.query[key];
      });
    }

    // 复制数据，因为自定义的模板对象中有函数所以不能用 JSON 处理复制
    let customTabTwoTemplate;
    if (typeof this.trendConfig.customTabTwoTemplate !== 'undefined') {
      customTabTwoTemplate = this.trendConfig.customTabTwoTemplate;
      delete this.trendConfig.customTabTwoTemplate;
    }
    const trendConfig = JSON.parse(JSON.stringify(this.trendConfig));
    if (customTabTwoTemplate) {
      this.trendConfig.customTabTwoTemplate = customTabTwoTemplate;
      trendConfig.customTabTwoTemplate = customTabTwoTemplate;
    }

    if (trendConfig.query) {
      trendConfig.query = Util.analysisQuery(
        Object.assign(query || {}, {}), row, trendConfig.query);
    }
    if (trendConfig.autoDims) {
      trendConfig['dimList'] = this.dimsList;
    }

    if (trendConfig.titleFields && trendConfig.titleFields.length) {
      trendConfig.title = trendConfig.titleFields.reduce((rs, field) => {
        if (row[field]) {
          if (rs === '') {
            rs += row[field];
          } else {
            rs += ' - ' + row[field] || '';
          }
        }
        return rs;
      }, '');
    }

    // 如果某个详情有配置单独的备注列表，则根据配置的相关参数拉取备注列表
    /*if (trendConfig.remark) {
      this.remarkService.read(Util.analysisQuery(query, row, trendConfig.remark.query)).subscribe({
        next: (data) => {
          trendConfig['chartConfig']['_remarkList'] = data.data;
          this.trendDialogService.show(trendConfig);
        },
        error: () => {
          this.trendDialogService.show(trendConfig);
        }
      });
    } else {
      this.trendDialogService.show(trendConfig);
    }*/
  }

  rowEdit(row) {
    this.onRowEdit.emit(row);
  }

  rowDetail(row) {
    this.onRowDetail.emit(row);
  }

  rowDelete(row) {
    if (confirm('确认删除?')) {
      this.onRowDelete.emit(row);
    }
  }

  linkToDetail(row) {
    const gpvList = ['fplatformfsk', 'fhallfsk', 0, 0, 0].map(key => typeof row[key] !== 'undefined' ? row[key] : 0).join('|');
    const labelList = ['fplatformname', 'fhallname', 0, 0, 0].map(key => {
      if (key === 'fplatformname') {
        // 首页地图表格数据特殊处理
        if (row['fname']) {
          return row['fname'];
        } else {
          return row['fplatformname'];
        }
      }
      return typeof  row[key] !== 'undefined' ? row[key] : '未知';
    }).join('-');
    this.configService.saveGpv({ gpv: gpvList, gpv_name: labelList}).subscribe(() => {
      this.globalDataService.setParams({ gpv: [gpvList], gpv_name: labelList });
      this.router.navigate(['/gameOverview']);
    });
  }

  exportCSV() {
    this.myDataTable.exportCSV();
  }

  copyClipboard() {
    this.myDataTable.copy();
  }

  addPercentClass(val) {
    return /^[\d-].+%$/.test(val) ? (/^-/.test(val) ? 'text--reduce' : 'text--increase') : '';
  }

  isNumber(val) {
    return typeof val === 'number';
  }

  showRatio(val) {
    return typeof val !== 'undefined';
  }

  formatRatio(val) {
    return val === '0.0%' ? '' : val;
  }

  selectDimValue(target) {
    this.dimSelected = target.value;
    this.tableDim = [];
    this.tableDimValue = [];
    this.dimList.forEach((item) => {
      if (target.value.indexOf(item.value) > -1) {
        this.tableDim.push({'label': item.label, 'value': item.value});
      }
    });
    this.selectChange.emit({'type': 'dimensions', 'value': this.dimSelected});
  }

  changeDataByDim(target) {
    this.tableDimChange.emit(target.value);
  }
}
