import { Injectable } from '@angular/core';
import { FetchService } from './fetch.service';

@Injectable()
export class LoginService {

  constructor(private fetch: FetchService) { }

  /**
   * 登录
   * @returns {Observable<any>}
   */
  userLogin(params) {
    return this.fetch.post('/users/login', params);
  }

  userRegister(params) {
    return this.fetch.post('/users/register', params);
  }


  /**
   * 激活账号
   * @returns {Observable<any>}
   */
  userActive(url, token) {
    return this.fetch.get(url, token);
  }
}
