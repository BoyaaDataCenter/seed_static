import { Injectable } from '@angular/core';
import { FetchService } from './../../core/services/fetch.service';

@Injectable()
export class DropdownService {

  constructor(private fetch: FetchService) { }

  /**
   * 获取下拉条件选择器的业务数据库
   * @returns {Observable<any>}
   */
  getBusinessDB(bid) {
    return this.fetch.get('/endpoints/databases/' + bid, null, true);
  }

  /**
   * 通过id拉取过滤组件数据
   * @returns {Observable<any>}
   */
  getListDataById(fid, param) {
    return this.fetch.post('/endpoints/query_filters/' + fid, param, true);
  }

  /**
   * 通过过滤参数拉取过滤组件数据
   * @returns {Observable<any>}
   */
  getListDataByParam(param) {
    return this.fetch.post('/endpoints/query_filters', param, true);
  }

}
