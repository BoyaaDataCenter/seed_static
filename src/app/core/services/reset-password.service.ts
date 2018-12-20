import { Injectable } from '@angular/core';
import { FetchService } from './fetch.service';

@Injectable()
export class ResetPasswordService {

  constructor(private fetch: FetchService) { }

  /**
   * 发送忘记密码请求
   * @returns {Observable<any>}
   */
  userResetApply(params) {
    return this.fetch.post('/users/forget_password', params);
  }

  /**
   * 重置密码
   * @returns {Observable<any>}
   */
  userResetPassword(params) {
    return this.fetch.post('/users/reset_password', params);
  }

}
