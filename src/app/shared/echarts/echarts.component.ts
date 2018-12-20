import {
  Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, Input, OnChanges, Output, EventEmitter, HostListener, NgZone
} from '@angular/core';
const echarts = require('../../../../node_modules/echarts/lib/echarts');

require('./shine');
/**
 * Echarts 图表底层封装
 */
@Component({
  selector: 'app-echarts',
  templateUrl: './echarts.component.html',
  styleUrls: ['./echarts.component.scss']
})
export class EchartsComponent implements AfterViewInit, OnDestroy, OnChanges {
  static DEFAULT_ROWS = 15;
  // 生成图表区域元素
  @ViewChild('chart') chartWrap: ElementRef;
  @Input() option;
  // 图表区域高度
  @Input() height;
  // 图标区域宽度
  @Input() width = 'auto';

  // 指标列表
  @Input() indexsList = [];
  // 维度列表
  @Input() dimList = [];

  @Input() indexsSelected = '';
  @Input() dimSelected = [];
  @Input() limitNum = 0;

  // 图表完成实例化事件
  @Output() init: EventEmitter<any> = new EventEmitter<any>();

  // 图表指标维度变化
  @Output() selectChange: EventEmitter<any> = new EventEmitter<any>();


  // 图表实例
  chart;

  pageShow = false;
  pageRows = EchartsComponent.DEFAULT_ROWS;
  pageTotalRecords;

  dataListCopy;
  axisListCopy;
  Measurer = { canvas: null };

  constructor(private zone: NgZone) {}

  /**
   * 监听图表配置变化，更新配置
   * @param changes
   */
  ngOnChanges(changes) {
    if (changes.option && changes.option.currentValue) {
      this.setOption();
    }
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.chart = echarts.init(this.chartWrap.nativeElement, 'shine');
      this.init.emit({ chart: this.chart, echarts: echarts });
      this.setOption();
    });
  }

  setOption() {
    if (this.chart && this.option) {
      this.chart.clear();
      if (typeof this.option.grid === 'undefined') {
        this.option.grid = {};
      }
      // 如果图的数据需要分页，切图的数据总量超过了每页显示的条数，则进行分页显示
      // 目前因为只有分布图需要分页，所以数据判断只做了 yAxis 的判断
      // TODO 对 xAxis 进行长度判断是否需要分页

      if (!!this.option.yAxis) {
        // 横向图的Y轴显示根据内容的长度修正left
        if (!!this.option.yAxis.data) {
          let defaultLeft = this.option.grid.left.replace('px', '');
          let leftWidth = this.option.yAxis.data.reduce((pre, cur) => {
            let curWidth = this.measureTextWidth(cur, null);
            return pre > curWidth ? pre : curWidth;
          }, defaultLeft);
          this.option.grid.left = leftWidth + 'px';
        }
      }

      // 判断是否有多条Y轴，存在多条Y轴，右边距需要设置为55px
      this.option.series.forEach((v) => {
        if (v.yAxisIndex > 0) {
          this.option.grid.right = '55px';
        }
      });

      if (this.option._page && this.option.yAxis.data.length > this.pageRows) {
        this.pageShow = true;
        const page = this.option._page;
        this.pageRows = page.rows || EchartsComponent.DEFAULT_ROWS;
        this.pageTotalRecords = this.option.series[0].data.length;
        this.dataListCopy = this.option.series.reduce((rs, item) => {
          rs.push(JSON.parse(JSON.stringify(item.data)));
          return rs;
        }, []);
        this.axisListCopy = JSON.parse(JSON.stringify(this.option.yAxis.data));
        this.setOptionByPage(0);
      } else {
        this.pageShow = false;
        this.chart.setOption(this.option);
      }
    }
  }

  measureTextWidth(text, font) {
      var canvas = this.Measurer.canvas || (this.Measurer.canvas = document.createElement('canvas'));
      var context = canvas.getContext('2d');
      context.font = font;
      var metrics = context.measureText(text);
      return Math.floor(metrics.width) + 10;
  }

  setOptionByPage(beginNum) {
    const dataList = JSON.parse(JSON.stringify(this.dataListCopy));
    const axisList = JSON.parse(JSON.stringify(this.axisListCopy));
    this.option.series.map((item, i) => {
      item.data = dataList[i].reverse().splice(beginNum, this.pageRows).reverse();
      return item;
    });
    this.option.yAxis.data = axisList.reverse().splice(beginNum, this.pageRows).reverse();
    this.chart.setOption(this.option);
  }

  paginate(ev) {
    this.setOptionByPage(ev.first);
  }

  selectDimValue(target) {
    this.dimSelected = target.value;
    this.selectChange.emit({'type': 'dimensions', 'value': this.dimSelected});
  }

  selectIndexsValue(target) {
    console.log('target', target);
    this.indexsSelected = target.value;
    this.selectChange.emit({'type': 'indexs', 'value': this.indexsSelected});

  }

  /**
   * 窗口大小变化，重新渲染数据
   * @param ev
   */
  @HostListener('window:resize', ['$event'])
  onWindowResize(ev) {
    if (this.chart && this.chart.resize) {
      this.chart.resize();
    }
  }

  ngOnDestroy() {
    this.option = null;
    this.chart.dispose();
  }
}
