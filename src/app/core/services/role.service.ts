import { Injectable } from '@angular/core';
import {FetchService} from './fetch.service';

@Injectable()
export class RoleService {

  constructor(private fetch: FetchService) { }

  /**
   * 获取角色列表
   * @returns {Observable<any>}
   */
  getRoleList() {
    return this.fetch.get('/endpoints/role', null);
  }

  /**
   * 编辑角色信息
   * @returns {Observable<any>}
   */
  editRole(role_id, params) {
    return this.fetch.put('/endpoints/role/' + role_id, params);
  }

  /**
   * 删除角色
   * @returns {Observable<any>}
   */
  deleteRole(role_id) {
    return this.fetch.delete('/endpoints/role/' + role_id, null);
  }

  /**
   * 新增角色
   * @returns {Observable<any>}
   */
  addRole(params) {
    return this.fetch.post('/endpoints/role', params);
  }


}
