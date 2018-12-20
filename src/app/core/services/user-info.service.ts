import { Injectable } from '@angular/core';
import {FetchService} from './fetch.service';

@Injectable()
export class UserInfoService {

  constructor(private fetch: FetchService) { }

  /**
   * 获取用户信息
   * @returns {Observable<any>}
   */
  getUserInfo(user_id) {
    return this.fetch.get('/endpoints/account/' + user_id, null);
  }

  /**
   * 获取用户角色
   * @returns {Observable<any>}
   */
  getUserRole(user_id) {
    return this.fetch.get('/endpoints/buserrole/' + user_id, null);
  }

  /**
   * 获取业务角色
   * @returns {Observable<any>}
   */
  getRoleList() {
    return this.fetch.get('/endpoints/role', null);
  }

  /**
   * 设置业务角色
   * @returns {Observable<any>}
   */
  setUserRole(user_id, params) {
    return this.fetch.put('/endpoints/buserrole/' + user_id, params);
  }

  /**
   * 设置用户信息
   * @returns {Observable<any>}
   */
  setUserInfo(user_id, params) {
    return this.fetch.put('/endpoints/account/' + user_id, params);
  }

  /**
   * 上传用户头像
   * @returns {Observable<any>}
   */
  setUserAvatar(params) {
    return this.fetch.file('/utils/files', params);
  }
}
