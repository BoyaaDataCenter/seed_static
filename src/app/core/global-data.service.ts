import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

/**
 * 全局数据服务
 * 主要用于存储全局的数据
 */
@Injectable()
export class GlobalDataService {
  // 系统信息
  private params;

  // 页面查询参数
  private queryParam;

  // 菜单变化
  private menuChange = new Subject<any>();
  menuChange$ = this.menuChange.asObservable();

  // 组件配置变化
  private compChange = new Subject<any>();
  compChange$ = this.compChange.asObservable();

  // 全局查询条件变化
  private queryChange = new Subject<any>();
  queryChange$ = this.queryChange.asObservable();

  // 用户信息变化
  private userInfoChange = new Subject<any>();
  userInfoChange$ = this.userInfoChange.asObservable();

  private globalQueryParamData = new Subject<any>();
  globalQueryParamData$ = this.globalQueryParamData.asObservable();

  private queryParamsNum;

  constructor() {
    this.params = {
      userInfo: {},
      depInfo: {},
      pageParam: {}
    };
    this.queryParam = {
      global: {},
      panel: {}
    };
  };



  /**
   * 存储全局参数
   * @param params
   */
  setParams(params) {
    Object.keys(params).forEach((key) => {
      if (typeof params[key] !== 'undefined') {
        this.params[key] = params[key];
      }
    });
  }

  /**
   * 记录查询条件数量
   * @param params
   */
  setQueryParamsNum(num) {
    this.queryParamsNum = num;
    if (num == 0) {
      setTimeout(() => {
        this.onQueryChange();
      }, 20);

    }
  }

  /**
   * 记录查询条件数量
   * @param params
   */
  dealQueryParamsNum(type) {
    type == 1 ? this.queryParamsNum++ : this.queryParamsNum-- ;
  }


  /**
   * 获取查询参数
   * @returns {any}
   */
  getParams() {
    return this.params;
  }

  /**
   * 存储页面查询参数
   * @param params = {'type':'global', 'ename': '', 'data':{}}
   */
  setQueryParams(params) {
    if (params.backUp && params.backUp.length > 0) {
      delete this.queryParam[params['type']][params.backUp];
    }
    this.queryParam[params['type']][params['ename']] = {};
    Object.keys(params['data']).forEach((key) => {
      if (typeof params['data'][key] !== 'undefined') {
        this.queryParam[params['type']][params['ename']][key] = params['data'][key];
      }
    });
    // 如果全局过滤条件都加载完毕，并且变化的过滤条件不是父过滤条件，则通知页面重新加载数据
    if (Object.keys(this.queryParam.global).length >= this.queryParamsNum && !params['child']) {
      this.onQueryChange();
    }
  }

  /**
   * 重置页面查询参数
   *
   */
  resetQueryParams() {
    this.queryParam = {
      global: {},
      panel: {}
    };
  }

  /**
   * 删除页面查询参数
   * @param params = {'type':'global', 'ename': ''}
   */
  deleteQueryParams(params) {
    delete this.queryParam[params.type][params.ename];
    if (Object.keys(this.queryParam.global).length >= this.queryParamsNum) {
      this.onQueryChange();
    }
  }


  /**
   * 获取页面查询参数
   * @returns {any}
   */
  getQueryParams(type?) {
    return type ? this.queryParam[type] : this.queryParam;
  }


  /**
   * 通知菜单更新
   * @returns {any}
   */
  onMenuChange() {
    this.menuChange.next();
  }

  /**
   * 通知报表配置页面组件更新
   * @returns {any}
   */
  onCompChange(data) {
    this.compChange.next(data);
  }

  /**
   * 页面查询条件变化，需要更新数据
   * @returns {any}
   */
  onQueryChange() {
    this.queryChange.next(this.queryParam);
  }

  /**
   * 通知用户信息更新
   * @returns {any}
   */
  onUserInfoChange() {
    this.userInfoChange.next();
  }

  /**
   * 储存当前路由
   * @returns {Observable<any>}
   */
  setRouterSession( router ) {
    sessionStorage.setItem('seed_router_url', router);
  }

  /**
   * 获取已储存的路由
   * @returns {Observable<any>}
   */
  getRouterSession() {
    return sessionStorage.getItem('seed_router_url');
  }

  /**
   * 获取seession的business_id
   * @returns {Observable<any>}
   */
  getBusinessId() {
    return sessionStorage.getItem('business_session_id');
  }

  /**
   * 获取seession的business_id
   * @returns {Observable<any>}
   */
  setBusinessId(bid) {
    sessionStorage.setItem('business_session_id', bid);
  }

  /**
   * 清除seession的business_id
   * @returns {Observable<any>}
   */
  removeBusinessId() {
    sessionStorage.removeItem('business_session_id');
  }

  /**
   * 储存当前页面路由名
   * @returns {Observable<any>}
   */
  setPageName( pageName) {
    sessionStorage.setItem('pageName', pageName);
  }

  /**
   * 储存session里面的页面路由名
   * @returns {Observable<any>}
   */
  getPageName() {
    return sessionStorage.getItem('pageName');
  }

  /**
   * 清除session里面的页面路由名
   * @returns {Observable<any>}
   */
  removePageName() {
    sessionStorage.removeItem('pageName');
  }

  /**
   * 获取页面链接的bid和pid
   * @returns [bid, pid]
   */
  getBidAndPid() {
    const temp_ = window.location.pathname.split('/');
    return [parseInt(temp_[temp_.length - 2], 10), parseInt(temp_[temp_.length - 1], 10)];
  }

}
