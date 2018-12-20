import { Injectable } from '@angular/core';
import { FetchService } from './fetch.service';

@Injectable()
export class ReportElementService {

  constructor(private fetch: FetchService) { }

  /**
   * 获取下拉条件选择器的业务数据库
   * @returns {Observable<any>}
   */
  getBusinessDB(bid) {
    return this.fetch.get('/endpoints/databases/' + bid, null, true);
  }

  /**
   * 获取sql解析数据
   * @returns {Observable<any>}
   */
  getSqlFields(param) {
    return this.fetch.post('/utils/sql_fields', param, true);
  }

  /**
   * 面板-SQL解析字段
   * @returns {Observable<any>}
   */
  getSqlData(param) {
    return this.fetch.post('/endpoints/query_data', param, true);
  }

  /**
   * 面板-SQL解析字段
   * @returns {Observable<any>}
   */
  getSqlDataByPid(pid, param) {
    return this.fetch.post('/endpoints/query_data/' + pid, param, true);
  }

}
