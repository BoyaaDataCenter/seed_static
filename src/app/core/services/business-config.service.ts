import { Injectable } from '@angular/core';
import { FetchService } from './fetch.service';

@Injectable()
export class BusinessConfigService {

  constructor(private fetch: FetchService) { }

  /**
   * 获取业务列表
   * @returns {Observable<any>}
   */
  getBusinessList() {
    return this.fetch.get('/endpoints/bussiness', null);
  }

  /**
   * 编辑业务
   * @returns {Observable<any>}
   */
  editBusiness(params) {
    return this.fetch.post('/endpoints/bussiness', params);
  }

  /**
   * 删除业务
   * @returns {Observable<any>}
   */
  deleteBusiness(business_id) {
    return this.fetch.delete('/endpoints/bussiness/' + business_id, null);
  }

  /**
   * 获取业务数据库列表
   * @returns {Observable<any>}
   */
  getDbList( business_id ) {
    return this.fetch.get('/endpoints/databases/' + business_id, null);
  }

  /**
   * 获取数据库类型列表
   * @returns {Observable<any>}
   */
  getDbTypeList() {
    return this.fetch.get('/utils/database_types', null);
  }

  /**
   * 编辑业务数据库
   * @returns {Observable<any>}
   */
  editDbList( business_id, params) {
    return this.fetch.put('/endpoints/databases/' + business_id, params);
  }

  /**
   * 测试业务数据库链接
   * @returns {Observable<any>}
   */
  testDbconnect( params) {
    return this.fetch.post('/utils/database_test', params);
  }

  /**
   * 储存当前页面所属的业务id
   * @returns {Observable<any>}
   */
  setBusinessId( business_id) {
    sessionStorage.setItem('business_session_id', business_id);
  }

  /**
   * 储存当前页面所属的业务id
   * @returns {Observable<any>}
   */
  setBusinessName( business_name) {
    sessionStorage.setItem('business_session_name', business_name);
  }

  /**
   * 获取模拟的用户id
   * @returns {Observable<any>}
   */
  getDebuggerId() {
    return sessionStorage.getItem('seed_debugger_user');
  }

}
