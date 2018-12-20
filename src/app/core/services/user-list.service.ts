import { Injectable } from '@angular/core';
import {FetchService} from './fetch.service';

@Injectable()
export class UserListService {

  constructor(private fetch: FetchService) { }

  /**
   * 获取业务用户列表
   * @returns {Observable<any>}
   */
  getBusUserList(business_id) {
    return this.fetch.get('/endpoints/buser/' + business_id, null);
  }

  /**
   * 删除业务用户
   * @returns {Observable<any>}
   */
  deleteBusUser(user_id) {
    return this.fetch.delete('/endpoints/buser/' + user_id, null);
  }

  /**
   * 新增业务用户
   * @returns {Observable<any>}
   */
  addBusUser(params) {
    return this.fetch.post('/endpoints/buser', params);
  }

  /**
   * 获取系统用户列表（除去业务用户列表的数据）
   * @returns {Observable<any>}
   */
  getOtherSysUserList() {
    return this.fetch.get('/endpoints/un_busers', null);
  }


  /**
   * 获取系统用户列表（全部用户数据）
   * @returns {Observable<any>}
   */
  getSysUserList() {
    return this.fetch.get('/endpoints/account', null);
  }


  /**
   * 编辑系统用户账号信息
   * @returns {Observable<any>}
   */
  editSysUser(user_id, params) {
    return this.fetch.put('/endpoints/account/' + user_id, params);
  }

  /**
   * 删除用户账号信息
   * @returns {Observable<any>}
   */
  deleteSysUser(user_id) {
    return this.fetch.delete('/endpoints/account/' + user_id, null);
  }

  /**
   * 新增用户账号
   * @returns {Observable<any>}
   */
  addUser() {
    return this.fetch.post('/endpoints/account', null);
  }

  /**
   * 获取角色列表
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

}
