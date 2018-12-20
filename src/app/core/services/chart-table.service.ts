import { Injectable } from '@angular/core';
import {FetchService} from './fetch.service';

@Injectable()
export class ChartTableService {

  constructor(private fetch: FetchService) { }

  /**
   * 获取趋势数据
   * @param params 趋势查询参数
   * @param version 接口版本
   * @param url 接口地址
   * @returns {any}
   */
  getData(params, version: 1 | 2, url?) {
    if (version == 1 && typeof url === 'undefined') {
      url = 'common/';
    } else if (version == 2 && typeof url === 'undefined') {
      url = '';
    }

    return this.fetch.get(url, params);
  }
}
