import { Injectable } from '@angular/core';
import {FetchService} from './fetch.service';

@Injectable()
export class SetService {

  constructor(
    private fetch: FetchService
  ) { }

  /**
   * 获取业务列表
   * @returns {any}
   */
  getBusinessList() {
    return this.fetch.get('/business/list', null, true);
  }

  /**
   * 获取用户列表
   * @returns {any}
   */
  getUserList() {
    return this.fetch.get('/user/list/', null, true);
  }

  /**
   * 获取业务数据库列表
   * @returns {any}
   */
  getReportDetail(params) {
    return this.fetch.get('/business/database/list', params, true);
  }

  /**
   * 业务删除
   * @param params
   * @returns {any}
   */
  postBusinessDelete(params) {
    return this.fetch.post('/business/delete', params, true, true);
  }

  /**
   * 业务更新/新增
   * @param params
   * @returns {any}
   */
  postBusinessUpsert(params) {
    return this.fetch.post('/business/upsert', params, true, true);
  }

  /**
   * 新增/更新数据库
   * @param params
   * @returns {any}
   */
  postBusinessDatabaseUpsert(params) {
    return this.fetch.post('/business/database/upsert', params, true, true);
  }

  /**
   * 获取业务数据库类型列表
   * @returns {any}
   */
  getCommonDbtypeList() {
    return this.fetch.get('/common/dbtype/list', null, true);
  }

  /**
   * 删除数据库
   * @param params
   * @returns {any}
   */
  postBusinessDatabaseDelete(params) {
    return this.fetch.post('/business/database/delete', params, true, true);
  }
}
