import { Injectable } from '@angular/core';
import {NumberFormatPipe} from '../shared/number-format.pipe';
// import {GlobalDataService} from './global-data.service';

@Injectable()
export class ChartService {
  numberFormatPipe = new NumberFormatPipe();
  chartRemarkData;
  chartBoundaryGapEnable: Boolean;
  chartReverseEnable: Boolean;
  chartHasSecondValueAxis: Boolean;
  chartLegendShow: Boolean;
  chartLegendData;
  chartGridConfig;
  userChartData;
  chartDataSum = {};
  private _userChartConfig;
  set userChartConfig(chartConfig) {
    this.chartGridConfig = {
      grid: {
        left: '55px',
        right: '40px',
        top: '28px',
        bottom: '40px'
      }
    };
    Object.assign(this.chartGridConfig.grid, chartConfig.grid || {});
    this._userChartConfig = chartConfig;
  }
  get userChartConfig() {
    return this._userChartConfig;
  }

  constructor(
  ) {}

  getChartOptionByType(chartConfig, data) {
    // console.log('chartConfig', chartConfig, 'data', data);
    this.userChartConfig = JSON.parse(JSON.stringify(chartConfig));
    this.userChartData = JSON.parse(JSON.stringify(data));
    this.initConfig();
    let chartOption = {};

    if (this.userChartConfig.base === 'sankey') {
      chartOption = this.getSankeyConfig();
    } else if (this.userChartConfig.base === 'pie') {
      chartOption = this.getPieConfig();
    } else if (this.userChartConfig.base === 'funnel') {
      chartOption = this.getFunnel();
    }else {
      // 数据格式兼容处理
      // 因为项目前期后端穿回来的数据格式与后期传回的数据格式不统一
      if (this.userChartData.series.length && typeof this.userChartData.series[0] === 'number') {
        this.userChartData.series = [{ dim: '', data: JSON.parse(JSON.stringify(this.userChartData.series)) }];
      }

      this.setDataReverse();
      this.setTopConfig();
      this.setPageConfig();
      this.setSeriesConfig();
      const categoryAxis = {
        type: 'category',
        data: this.userChartData.categories,
        boundaryGap: this.chartBoundaryGapEnable
      };
      const valueAxis = this.chartHasSecondValueAxis ?
        [{ type: 'value', axisLabel: { formatter: (val) => this.numberFormatPipe.transform(val, 3) }},
          { type: 'value', axisLabel: { formatter: (val) => this.numberFormatPipe.transform(val, 3) }}] :
        [{ type: 'value', axisLabel: { formatter: (val) => this.numberFormatPipe.transform(val, 3) }}];
      chartOption = Object.assign(this.chartGridConfig, {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: this.tooltipFormatter.bind(this)
        },
        dataZoom: [
          {
            show: !!this.userChartConfig.dataZoom && !!this.userChartConfig.dataZoom.show,
            realtime: true,
            start: 0,
            end: 100
          }
        ],
        legend: {
          type: 'scroll',
          data: this.chartLegendShow && this.userChartData.series.length > 1 ? this.chartLegendData : [],
          top: 0,
          selected: (() => {
            let obj = {};
            this.chartLegendData.forEach((item, index) => {
                obj[item] = index < 10;
            });
            return obj;
          })()
        },
        xAxis: this.chartReverseEnable ? valueAxis : categoryAxis,
        yAxis: this.chartReverseEnable ? categoryAxis : valueAxis,
        series: this.userChartData.series
      });
    }
    return chartOption;
  }

  /**
   * 获取配置列表
   */
  getRemarkMap() {
    return this.userChartConfig['_remarkList'].reduce((rs, remark) => {
      const date = remark['fdate'];
      const item = {
        title: '',
        content: remark.event
      };
      if (rs[date]) {
        rs[date].push(item);
      } else {
        rs[date] = [item];
      }
      return rs;
    }, {});
  }

  /**
   * 获取桑基图配置
   */
  getSankeyConfig() {
    if (this.userChartData.nodes.length && this.userChartData.links.length) {
      return Object.assign(this.chartGridConfig, {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          formatter: params => params.name + ': ' + this.numberFormatPipe.transform(params.value, 1)
        },
        series: [
          {
            type: 'sankey',
            layout: 'none',
            right: '130px',
            left: '30px',
            data: this.userChartData.nodes,
            links: this.userChartData.links,
            itemStyle: { normal: { borderWidth: 1, borderColor: '#aaa' }},
            lineStyle: { normal: { curveness: 0.5 }}
          }
        ]
      });
    } else {
      return {};
    }
  }

  /**
   * 获取饼图配置
   */
  getPieConfig() {
    const series = this.userChartData.series;
    const categories = this.userChartData.categories;
    // 嵌套饼图配置
    if (series.length === 2) {
      Object.assign(series[0], {
        type: 'pie',
        radius: [0, '35%'],
        label: {
          normal: {
            position: 'inner'
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        }
      });
      Object.assign(series[1], {
        type: 'pie',
        radius: ['45%', '60%']
      });

      // 处理外层饼图的数据，当外层饼图数据超过 10 条时，将 10 条后面的数据加总变为"其它"项
      const outData = series[1].data;
      if (outData.length > 10) {
        const other = outData.splice(10);
        outData[10] = other.reduce((rs, item) => {
          rs.value += parseInt(item.value, 10);
          return rs;
        }, {name: '其它', value: 0});
      }

      return Object.assign(this.chartGridConfig, {
        series: series,
        tooltip: {
          trigger: 'item',
          formatter: this.tooltipFormatter.bind(this)
        },
      });

    // 单饼图配置
    } else if (series.length === 1) {
      Object.assign(series[0], {
        type: 'pie',
        radius: [0, '60%']
      });

      let tempData = [];
      series[0].data.forEach((v, index) => {
        if (v > 0) {
          let item = {
            value: v,
            name: categories[index]
          }

          tempData.push(item);
        }
      });

      series[0].data = tempData;
      return Object.assign(this.chartGridConfig, {
        series: series,
        tooltip: {
          trigger: 'item',
          formatter: this.tooltipFormatter.bind(this)
        },
      });
    }
  }

  /**
   * 获取漏斗图配置
   */
  getFunnel() {
    const series = this.userChartData.series;

    Object.assign(series[0], {
      type: 'funnel',
      width: '80%',
      top: 20,
      bottom: 20,
      left: '10%',
      sort: 'none'
    });

    return Object.assign(this.chartGridConfig, {
      series: series,
      tooltip: {
        trigger: 'item',
        formatter: this.tooltipFormatter.bind(this)
      }
    });
  }

  initConfig() {
    if (typeof this.userChartConfig.legend !== 'undefined') {
      this.chartLegendShow = !!this.userChartConfig.legend;
    } else {
      this.chartLegendShow = true;
    }
    this.chartReverseEnable = this.userChartConfig.reverse || false;
    this.chartBoundaryGapEnable = false;
    this.chartHasSecondValueAxis = false;
    this.chartLegendData = [];
  }

  /**
   * 根据 top 配置，截取相应的数据
   */
  setTopConfig() {
    let topConfig;
    if (this.userChartConfig.top) {
      topConfig = this.userChartConfig.top;
    }
    this.userChartData.series.forEach((seriesItem) => {
      if (typeof this.userChartConfig[seriesItem.dim] === 'object') {
        if (this.userChartConfig[seriesItem.dim].top) {
          topConfig = this.userChartConfig[seriesItem.dim].top;
        }
      }
    });
    if (topConfig) {
      const topNum = topConfig.num || 10;
      if (topConfig.reverse) {
        this.userChartData.categories = this.userChartData.categories.splice(-topNum);
        this.userChartData.series.map((item) => {
          item.data = item.data.splice(-topNum);
          return item;
        });
      } else {
        this.userChartData.categories = this.userChartData.categories.splice(0, topNum);
        this.userChartData.series.map((item) => {
          item.data = item.data.splice(0, topNum);
          return item;
        });
      }
    }
  }

  setPageConfig() {
    if (this.userChartConfig.reverse) {
      this.chartGridConfig['_page'] = {};
    }
    this.userChartData.series.forEach((seriesItem) => {
      if (typeof this.userChartConfig[seriesItem.dim] === 'object') {
        if (this.userChartConfig[seriesItem.dim].reverse) {
          this.chartGridConfig['_page'] = {};
        }
        if (typeof this.userChartConfig[seriesItem.dim].reverse !== 'undefined'
          && !this.userChartConfig[seriesItem.dim].reverse) {
          this.chartGridConfig['_page'] = null;
        }
      }
    });
  }

  setDataReverse() {
    this.userChartData.series.forEach((seriesItem) => {
      if (typeof this.userChartConfig[seriesItem.dim] === 'object') {
        if (typeof this.userChartConfig[seriesItem.dim].dataReverse === 'object') {
          if (this.userChartConfig[seriesItem.dim].dataReverse.base) {
            seriesItem.data = seriesItem.data.map(n => n * -1);
          }
        }
      }
    });
  }

  setSeriesConfig() {
    this.userChartData.series.map((seriesItem) => {
      let type = seriesItem.show_type || this.userChartConfig.base;
      let itemConfig = {};
      // 设置百分比配置
      if (seriesItem.rate) {
          seriesItem.name = seriesItem.name + '　';
          let sum = 1;
          if (seriesItem.data && seriesItem.data.length) {
            sum = seriesItem.data.reduce((rs, i) => rs + i);
          }
          this.chartDataSum[seriesItem.name] = sum;
      }

      if (seriesItem.yAxis == 'right') {
        this.chartHasSecondValueAxis = true;
        itemConfig = Object.assign(itemConfig, { type: type, yAxisIndex: 1});
      }else {
        itemConfig = Object.assign(itemConfig, { type: type });
      }
      if (type == 'area') {
        itemConfig = Object.assign(itemConfig, { type: 'line', areaStyle: {normal: {}}});
      }
      this.chartBoundaryGapEnable = true;
      if (typeof seriesItem === 'object' && seriesItem['name']) {
        this.chartLegendData.push(seriesItem['name']);
      }

      Object.assign(seriesItem, itemConfig, { top: 0, bottom: 0 });
      return seriesItem;
    });
  }

  tooltipFormatter(params) {
    let name;
    let tpl = '';

    if (params[0]) {
      name = params[0].name;
    } else if (params.name) {
      name = params.name;
    }

    tpl += `
              <div>${ name }</div>
              <div style="font-size: 12px;display: flex;color: #ffffff">
                <table>
            `;

    if (params) {
      if (params.length) {
        tpl += params.reduce((rs, item) => {
          if (typeof item.value !== 'undefined' && item.value !== null && item.value != 0) {
            let value = item.value;
            let sName = item.seriesName.split('　')[0];
            // 不是空字符串，是输入法 v 1 d 的字符
            if (/　$/.test(item.seriesName)) {
              value = this.numberFormatPipe.transform(Number(value), 1) + ' (' +
                (value / this.chartDataSum[item.seriesName] * 100).toFixed(2) +  '%)';
            }else {
              value = this.numberFormatPipe.transform(Number(value), 1);
            }
            return rs + `
                    <tr>
                      <td>
                        <div style='width: 10px;height: 10px;background-color: ${ item.color };border-radius: 50%;'></div>
                      </td>
                      <td>${ sName || '' }:</td>
                      <td style='text-align: right;'>${ value }</td>
                    </tr>
                  `;
          } else {
            return rs;
          }
        }, '');
      } else {
        if (typeof params.value !== 'undefined' && params.value !== null && params.value != 0) {
          let value = params.value;
          let sName = params.seriesName.split('　')[0];
          // 不是空字符串，是输入法 v 1 d 的字符
          if (/　$/.test(params.value)) {
            value = this.numberFormatPipe.transform(Number(value), 1) + ' (' +
              (value / this.chartDataSum[params.seriesName] * 100).toFixed(2) +  '%)';
          }else {
            value = this.numberFormatPipe.transform(Number(value), 1);
          }
          tpl += `
                <tr>
                  <td>
                    <div style='width: 10px;height: 10px;background-color: ${ params.color };border-radius: 50%;'></div>
                  </td>
                  <td>${ sName || '' }:</td>
                  <td style='text-align: right;'>
                    ${ value }
                  </td>
                </tr>
                `;
        }
      }
    }

    tpl += `</table>`;
    tpl += '<div>';

    return tpl;
  }
}
