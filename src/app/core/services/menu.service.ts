import { Injectable } from '@angular/core';
import { FetchService } from './fetch.service';

@Injectable()
export class MenuService {

  constructor(private fetch: FetchService) { }

  /**
   * 获取菜单列表
   * @returns {Observable<any>}
   */
  getMenuList() {
    return this.fetch.get('/endpoints/menu', null);
  }

  /**
   * 编辑菜单
   * @returns {Observable<any>}
   */
  editMenu(params) {
    return this.fetch.post('/endpoints/menu', params);
  }

}
