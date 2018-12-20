import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ConfigService} from '../core/services/config.service';
import {GlobalDataService} from '../core/global-data.service';
// import {RemarkService} from '../core/services/remark.service';

/**
 * 进入应用前获取用户信息
 */
@Injectable()
export class UserInfoResolveService implements Resolve<any> {

    specialRouterList = ['register', 'resetPassword'];

    constructor(
        private configService: ConfigService, private globalDataService: GlobalDataService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return Observable.create((sub) => {
            if (window['bowser'].check({chrome: '45'})) {
                // 显示加载loading
                this.showLoad();
                let bid; let pathName;
                const url = window.location.pathname.split('/');
                // 判断链接上是否具有业务id
                if (url[2]) {
                  pathName = window.location.pathname;
                  bid = url[2];
                }else if (url[1] == 'debugger' || url[1] == 'sysUserList' || url[1] == 'userInfo') {
                  pathName = '/' + url[1];
                }else if (this.specialRouterList.indexOf(url[1]) > -1) {
                  pathName = '/' + url[1] + window.location.search;
                }else {
                  // 判断session里面是否含有业务id
                  if (this.configService.getPathName()) {
                    bid = this.configService.getBusinessId();
                    pathName = this.configService.getPathName();
                  }else {
                    pathName = '/businessConfig';
                  }
                }
                // 储存路由路劲
                this.configService.setPathName(pathName);
                if (bid > 0) {
                  // 上报所选业务
                  this.configService.selectBusiness( {'bussiness_id': parseInt(bid, 10)} ).subscribe({
                    next : (succData) => {
                      this.configService.getUserInfo().subscribe({
                        next: (data) => {
                          let userInfo = data;
                          this.configService.getBusinessInfo(bid).subscribe({
                            next : (businessInfo) => {
                              this.configService.setBusinessId(bid);
                              this.configService.setBusinessName(businessInfo.name);
                              let temp = {
                                userInfo: userInfo,
                                menuData: []
                              };
                              sub.next(temp);
                              sub.complete();
                              this.removeLoading();
                            },
                            error: (err) => {
                              sub.error();
                              sub.complete();
                              this.removeLoading();
                            }
                          });
                        },
                        error: (err) => {
                          sub.error();
                          sub.complete();
                          this.removeLoading();
                        }
                      });
                    },
                    error: (err) => {
                      if (typeof err['code'] !== 'undefined') {
                        if (err['code'] !== 401) {
                          this.setErrInfoMsg(err['code'], err['message']);
                        }else {
                          this.configService.clearBusinessInfo();
                          pathName = '/login';
                          this.configService.setPathName(pathName);
                          let temp = {
                            userInfo: {},
                            menuData: []
                          };
                          sub.next(temp);
                          sub.complete();
                          this.removeLoading();
                          return;
                        }
                      } else {
                        this.setErrMsg(`请求发生错误！
                                              <br><br>错误信息：
                                              <br>HTTP 请求状态码不为 200。`);
                      }
                      sub.error();
                      sub.complete();
                      this.removeLoading();
                    }
                  });
                }else {
                  this.configService.getUserInfo().subscribe({
                    next: (data) => {
                      let userInfo = data;
                      let temp = {
                        userInfo: userInfo,
                        menuData: []
                      };
                      sub.next(temp);
                      sub.complete();
                      this.removeLoading();

                    },
                    error: (err) => {
                      if (typeof err['code'] !== 'undefined') {
                        if (err['code'] !== 401) {
                          this.setErrInfoMsg(err['code'], err['message']);
                        }else {
                          this.configService.clearBusinessInfo();
                          pathName = this.specialRouterList.indexOf(url[1]) > -1 ? '/' + url[1] : '/login';
                          this.configService.setPathName(pathName);
                          let temp = {
                            userInfo: {},
                            menuData: []
                          };
                          sub.next(temp);
                          sub.complete();
                          this.removeLoading();
                          return;
                        }
                      } else {
                        this.setErrMsg(`请求发生错误！
                                              <br><br>错误信息：
                                              <br>HTTP 请求状态码不为 200。`);
                      }
                      sub.error();
                      sub.complete();
                      this.removeLoading();
                    }
                  });
                }
            } else {
                sub.error();
                sub.complete();
                this.removeLoading();
            }
        });
    }

    showLoad() {
      const loading = document.getElementById('loading-container');
      loading.style.display = 'flex';
    }

    setErrMsg(msg) {
        const el = document.getElementById('bud-err-msg');
        el.innerHTML = msg;
        el.style.display = 'block';
    }

    setErrInfoMsg(code, msg) {
      const el = document.getElementById('bud-err-msg');
      el.innerHTML = `请求发生错误！
                      <br><br>错误信息：
                      <br>HTTP 请求状态码为 ${code}，
                      <br>错误信息为 ${msg}`;
      el.style.display = 'block';
    }

    removeLoading() {
        const loading = document.getElementById('loading-container');
        if (loading) {
            document.body.removeChild(loading);
        }
    }
}
