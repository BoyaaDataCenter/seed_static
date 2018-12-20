import { Pipe, PipeTransform } from '@angular/core';

/**
 * 搜索过滤器
 */
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  /**
   *
   * @param list 待搜索列表
   * @param keyword 搜索关键字
   * @param fields 待搜索字段
   * @returns {null}
   */
  transform(list: any[], keyword: string, fields: string[]): any {
    if (list && list.length) {
      return list.filter((item) => {
        let hasKeyword = false;
        hasKeyword = fields.some((key => {
          let reg = new RegExp('', 'gi');
          // 虽然对一些特殊字符串做了替换
          // 但是不排除会出现不明特殊字符导致正则表达式初始化失败
          try {
            reg = new RegExp(keyword.replace(/([\*\.\?\+\$\^\[\]\(\)\{\}\|\\\/])/g, (match, $1) => '\\' + $1), 'gi');
          } catch (err) {

          }
          return reg.test(item[key]);
        }));
        // 过滤标识
        item['_isFilter'] = hasKeyword;
        return hasKeyword;
      });
    } else {
      return [];
    }
  }
}
