import { Injectable } from '@angular/core';
import { FetchService } from './fetch.service';

@Injectable()
export class ReportConfigService {

  constructor(private fetch: FetchService) { }

  /**
   * 获取全局条件数据
   * @returns {Observable<any>}
   */
  getHeaderData(fid) {
    return this.fetch.get('/endpoints/filters/' + fid, null);
  }

  /**
   * 获取报表页面数据
   * @returns {Observable<any>}
   */
  getPageData(pid) {
    return this.fetch.get('/endpoints/pages/' + pid, null);
  }

  /**
   * 保存全局条件数据
   * @returns {Observable<any>}
   */
  saveHeaderData(params) {
    return this.fetch.post('/endpoints/filters', params);
  }

  /**
   * 保存页面配置数据
   * @returns {Observable<any>}
   */
  savePageData(pid, params) {
    return this.fetch.put('/endpoints/pages/' + pid, params);
  }

  /**
   * 删除全局组件
   * @returns {Observable<any>}
   */
  deleteHeaderComp(cid) {
    return this.fetch.delete('/endpoints/filters/' + cid, null);
  }

}
