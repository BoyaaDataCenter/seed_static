export class Util {


  /**
   * # 查询参数公共解析方法
   *
   * ## 查询参数以对象的方式传入, 其中参数的值有以下几种配置形式：
   * ### 字符串或者数值，对此类参数不做处理，保留其原始值
   * ```javascript
   * {
   *  key: 'value'
   * }
   * ```
   * ### 对象形式，对象形式又分以下几类：
   * - 对象中没有包含特殊 key 的，对此类参数不做处理，保留其原始值
   * ```javascript
   * {
   *  key: {subKey: 'subValue'}
   * }
   * ```
   * - 对象中包含特殊 key 的（后称配置对象），配置对象拥有以下几种配置:
   * 1. _replace 配置，可替换参数，_replace 的 value 包含以下两种形式：
   * 1.1 value 字段不含有 $ 符号的，将用 _replace 的值在 scope 中作 key 查找相应的值，替换配置对象作为 key 的 value
   * ```javascript
   * {
   *  key: {_replace: 'replaceKey'}
   * }
   * ```
   * 1.1 value 字段包含 $ 符号的，将用 _replace 的值在 rootScope 中作 key 查找相应的值，替换配置对象作为 key 的 value
   * ```javascript
   * {
   *  key: {_replace: '$replaceKey'}
   * }
   * ```
   * 2. _condition 配置，条件参数：
   * _condition 的 value  为一个对象，以下面的代码为例说明：scopeKey 为  scope 上的一个属性, scopeKey 的 value 为数组：
   * ['conditionOneValue', 'conditionOneQueryValue']，conditionOneValue 是一个待比较的值，和 scope[scopeKey] 比较，
   * 如果比较相等，则取 conditionOneQueryValue 作为 key的值。可以配置多个待比较值及对应的查询参数。以此类推。
   *
   * ```javascript
   * {
   *  key: {_condition: { scopeKey: ['conditionOneValue', 'conditionOneQueryValue'...]}}
   * }
   * ```
   * @param rootScope
   * @param scope
   * @param query
   * @private
   */
  static analysisQuery (rootScope, scope, query) {
    const cpQuery = JSON.parse(JSON.stringify(query));
    Util._analysisQuery(rootScope, scope, cpQuery);
    return cpQuery || null;
  }

  static _analysisQuery(rootScope, scope, query) {
    Object.keys(query).forEach((key) => {
      const value = query[key];
      if (typeof value === 'object') {
        if (value._condition) {
          const conditions = value._condition;
          for (const conditionKey in conditions) {
            if (conditions.hasOwnProperty(conditionKey)) {
              const rightValue = scope[conditionKey];
              conditions[conditionKey].forEach((compareValue, i) => {
                if (i % 2 === 0) {
                  if (typeof rightValue !== 'undefined' && rightValue.toString() === compareValue.toString()) {
                    query[key] = conditions[conditionKey][i + 1];
                  }
                }
              });
            }
          }
        }
        if (value._replace) {
          const replaceFiled = value._replace;
          if (/^\$/.test(replaceFiled)) {
            query[key] = rootScope[replaceFiled.split('$')[1]];
          } else {
            query[key] = scope[replaceFiled];
          }
        } else {
          this._analysisQuery(rootScope, scope, value);
        }
      }
    });
  }

  /**
   * 获取日期字符串
   * @param date
   * @returns {any}
   */
  static getDateStr(date) {
    const y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    if (m < 10) {
      m = '0' + m;
    }
    if (d < 10) {
      d = '0' + d;
    }
    return y + '-' + m + '-' + d;
  }

  static isUndefined (val: any): boolean {
    return typeof val === 'undefined';
  }


  // 深复制
  static fnDeepClone(obj) {
    let result = typeof obj.splice === 'function' ? [] : {},
      key;
    if (obj && typeof obj === 'object') {
      for (key in obj ) {
        if (obj[key] && typeof obj[key] === 'object') {
          result[key] = this.fnDeepClone(obj[key]); // 如果对象的属性值为object的时候，递归调用deepClone，即再把某个值对象复制一份到新的对象的对应值中
        }else {
          result[key] = obj[key];  // 如果对象的属性值不为object的时候，直接复制参数对象的每一个键/值到新对象对应的键/值中
        }
      }
      return result;
    }
    return obj;


  }
}
