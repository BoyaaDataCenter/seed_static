import { Injectable } from '@angular/core';
import {FetchService} from './fetch.service';

@Injectable()
export class RoleMenuService {

  constructor(private fetch: FetchService) { }

  /**
   * 获取角色菜单列表
   * @returns {Observable<any>}
   */
  getRoleMenuList(role_id) {
    return this.fetch.get('/endpoints/rolemenu/' + role_id, null);
  }

  /**
   * 编辑角色菜单列表
   * @returns {Observable<any>}
   */
  editRoleMenuList(role_id, params) {
    return this.fetch.put('/endpoints/rolemenu/' + role_id, params);
  }

}
