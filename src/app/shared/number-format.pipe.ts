import { Pipe, PipeTransform } from '@angular/core';

/**
 * 格式化数据
 */
@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  /**
   * 格式化数字
   * @param number 原始值
   * @param type 转换类型，有以下几种类型：
   *  1 转换为 K M B
   *  2 千分位法
   *  3 转换为 K M B 不带小数
   */
  transform(number, type) {
    if (typeof number === 'undefined') {
      return '-';
    }
    if (Number.isNaN(+number)) {
      return number;
    }
    if (+number === 0) {
      return '0';
    }
    const num = +number;
    let result = this.fixed(num);
    // 转换为 K, M 单位
    if (type === 1 || type === 3) {
      const abs = Math.abs(num);
      let suffix = '';
      if (abs >= Math.pow(10, 9)) {
        result = this.fixed(num / Math.pow(10, 9));
        suffix = 'B';
      } else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6)) {
        result = this.fixed(num / Math.pow(10, 6));
        suffix = 'M';
      } else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3)) {
        result = this.fixed(num / Math.pow(10, 3));
        suffix = 'K';
      } else {
        return  number;
      }
      if (type === 1) {
        return this.buildNumber(result) + suffix;
      } else if (type === 3) {
        const rest = this.buildNumber(result);
        return  rest.substr(0, rest.length - 1) + suffix;
      }
    // 转换为千分位法
    } else if (type === 2) {
      return this.buildNumber(number);
    } else {
      console.error('数据格式化，类型参数错误！');
    }
  }

  fixed(num) {
    return Number(num).toFixed(2);
  }

  buildNumber(number) {
    if (number.toString().indexOf('.') !== -1) {
      const numberStr = number.toString().split('.');
      return numberStr[0].replace(/\d(?=(\d{3})+$)/g, '$&,') + '.' + numberStr[1];
    } else {
      return number.toFixed().replace(/\d(?=(\d{3})+$)/g, '$&,');
    }
  }

}
