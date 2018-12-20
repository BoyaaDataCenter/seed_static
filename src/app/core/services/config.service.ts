import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {FetchService} from './fetch.service';
import {environment} from '../../../environments/environment';

@Injectable()
export class ConfigService {

  constructor(private fetch: FetchService) { }

  /**
   * 获取用户信息
   * @returns {Observable<any>}
   */
  getUserInfo() {
    return this.fetch.get('/endpoints/user', null);
  }

  /**
   * 获取用户角色
   * @returns {Observable<any>}
   */
  getUserRole(user_id) {
    return this.fetch.get('/endpoints/buserrole/' + user_id, null);
  }

  /**
   * 获取用户菜单
   * @returns {Observable<any>}
   */
  getUserMenu() {
    return this.fetch.get('/endpoints/user/menu', null);
  }

  /**
   * 获取业务详情
   * @returns {}
   */
  getBusinessInfo(bid) {
    return this.fetch.get('/endpoints/bussiness/' + bid, null);
  }

  /**
   * 登出
   */
  loginOut() {
    return this.fetch.get('/users/logout', null);
  }

  /**
   * 获取应用选择器选项列表
   * @returns {Observable<any>}
   */
  getAppIdList() {
    return this.fetch.get('user/gpv/list/', null, true);
  }

  /**
   * 保存用户版本选择器设置
   * @param body
   * @returns {any}
   */
  saveGpv(body) {
    return this.fetch.post('common/user/gpv/', body, true);
  }

  /**
   * 储存链接的路由信息
   * @returns {Observable<any>}
   */
  setPathName(path) {
    sessionStorage.setItem( 'path_name', path);
  }

  /**
   * 获取链接的路由信息
   * @returns {Observable<any>}
   */
  getPathName() {
    return sessionStorage.getItem( 'path_name');
  }

  /**
   * 上报用户所选业务
   * @param body
   * @returns {any}
   */
  selectBusiness(param) {
    return this.fetch.post('/endpoints/buserselect', param, true);
  }

  /**
   * 获取seession的business_id
   * @returns {Observable<any>}
   */
  getBusinessId() {
    return sessionStorage.getItem('business_session_id');
  }

  /**
   * 设置seession的business_id
   * @returns {Observable<any>}
   */
  setBusinessId(bid) {
    sessionStorage.setItem('business_session_id', bid);
  }

  /**
   * 获取seession的business_name
   * @returns {Observable<any>}
   */
  getBusinessName() {
    return sessionStorage.getItem('business_session_name');
  }

  /**
   * 储存当前页面所属的业务id
   * @returns {Observable<any>}
   */
  setBusinessName( business_name) {
    sessionStorage.setItem('business_session_name', business_name);
  }

  /**
   * 清除seession的business相关信息
   * @returns {Observable<any>}
   */
  clearBusinessInfo() {
    sessionStorage.removeItem('business_session_name');
    sessionStorage.removeItem('business_session_id');
    sessionStorage.removeItem('path_name');
  }

}
