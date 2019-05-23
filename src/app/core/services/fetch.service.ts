import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Headers} from '@angular/http';
import {environment} from '../../../environments/environment';
import {DebuggerService} from '../debugger.service';
declare const require: any;
const NProgress = require('nprogress');
const iziToast = require('izitoast');

NProgress.configure({ showSpinner: false });

/**
 * 封装 http 请求方法，便于集中处理
 */
@Injectable()
export class FetchService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private debuggerServer: DebuggerService) { }

  /**
   * 封装 GET 请求
   * @param url 请求地址
   * @param params 请求参数
   * @param roa 请求配置
   * @param all 全部返回值
   * @returns {any}
   */
  get(url, params, hasWarning = false, all = false): Observable<any> {
    return Observable.create((sub) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      NProgress.start();
      this.http.get(this.getFullUrl(url) + this.formatData(params, true), {
        headers: headers,
        withCredentials: true
      }).subscribe({
        next: (res) => {
          NProgress.done();
          const data = res.json();
          this.codeHandler(data);
          if (data.code === 200) {
            if (all) {
              sub.next(data);
            }else {
              sub.next(data.data);
            }
          } else {
            if (hasWarning) {
              iziToast.error({
                position: 'topRight',
                title: '请求错误!',
                message: `${data.message}`,
              });
            }
            sub.error(data);
          }
          sub.complete();
        },
        error: (err) => {
          NProgress.done();
          if (hasWarning) {
            iziToast.error({
              position: 'topRight',
              title: '请求错误!',
              message: url,
            });
          }
          sub.error(err);
          sub.complete();
          this.errorHandler(err);
        }
      });
    });
  }

  /**
   * 封装 POST 请求
   * @param url 请求地址
   * @param body 请求实体
   * @param hasWarning 是否需要弹出警告信息
   * @returns {any}
   */
  post(url, body, hasWarning = false, hasSuccessWarning = false, all = false) {
    return Observable.create((sub) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      NProgress.start();
      this.http.post(this.getFullUrl(url), body, {
        withCredentials: true,
        headers: headers
      }).subscribe({
        next: (res) => {
          NProgress.done();
          const data = res.json();
          this.codeHandler(data);
          if (data.code === 200) {
            if (hasSuccessWarning) {
              iziToast.success({
                position: 'topRight',
                title: 'success!',
                message: `${data.message}`
              });
            }
            if (all) {
              sub.next(data);
            }else {
              sub.next(data.data);
            }
          } else {
            if (hasWarning) {
              iziToast.error({
                position: 'topRight',
                title: '请求错误!',
                message: `${data.message}`
              });
            }
            sub.error(data);
          }
          sub.complete();
        },
        error: (err) => {
          NProgress.done();
          if (hasWarning) {
            iziToast.error({
              position: 'topRight',
              title: '请求错误!',
              message: url,
            });
          }
          sub.error(err);
          sub.complete();
          this.errorHandler(err);
        }
      });
    });
  }

  /**
   * 封装 POST 上传文件的请求
   * @param url 请求地址
   * @param params 请求实体
   * @param file 上传文件
   * @param hasWarning 是否需要弹出警告信息
   * @returns {any}
   */
  file(url, params, hasWarning = false, hasSuccessWarning = false, all = false) {
    return Observable.create((sub) => {
      const headers = new Headers();
      // headers.append('Content-Type', 'multipart/form-data');
      NProgress.start();
      this.http.post(this.getFullUrl(url), params, {
        withCredentials: true,
        headers: headers
      }).subscribe({
        next: (res) => {
          NProgress.done();
          const data = res.json();
          this.codeHandler(data);
          if (data.code === 200) {
            if (hasSuccessWarning) {
              iziToast.success({
                position: 'topRight',
                title: 'success!',
                message: `${data.message}`
              });
            }
            if (all) {
              sub.next(data);
            }else {
              sub.next(data.data);
            }
          } else {
            if (hasWarning) {
              iziToast.error({
                position: 'topRight',
                title: '请求错误!',
                message: `${data.message}`
              });
            }
            sub.error(data);
          }
          sub.complete();
        },
        error: (err) => {
          NProgress.done();
          if (hasWarning) {
            iziToast.error({
              position: 'topRight',
              title: '请求错误!',
              message: url,
            });
          }
          sub.error(err);
          sub.complete();
          this.errorHandler(err);
        }
      });
    });
  }

  /**
   * 封装 PUT 请求
   * @param url 请求地址
   * @param body 请求实体
   * @param hasWarning 是否需要弹出警告信息
   * @returns {any}
   */
  put(url, body, hasWarning = false, hasSuccessWarning = false, all = false) {
    return Observable.create((sub) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      NProgress.start();
      this.http.put(this.getFullUrl(url), body, {
        withCredentials: true,
        headers: headers
      }).subscribe({
        next: (res) => {
          NProgress.done();
          const data = res.json();
          this.codeHandler(data);
          if (data.code === 200) {
            if (hasSuccessWarning) {
              iziToast.success({
                position: 'topRight',
                title: 'success!',
                message: `${data.message}`
              });
            }
            if (all) {
              sub.next(data);
            }else {
              sub.next(data.data);
            }
          } else {
            if (hasWarning) {
              iziToast.error({
                position: 'topRight',
                title: '请求错误!',
                message: `${data.message}`
              });
            }
            sub.error(data);
          }
          sub.complete();
        },
        error: (err) => {
          NProgress.done();
          if (hasWarning) {
            iziToast.error({
              position: 'topRight',
              title: '请求错误!',
              message: url,
            });
          }
          sub.error(err);
          sub.complete();
          this.errorHandler(err);
        }
      });
    });
  }

  /**
   * 封装 DELETE 请求
   * @param url 请求地址
   * @param body 请求实体
   * @param hasWarning 是否需要弹出警告信息
   * @returns {any}
   */
  delete(url, body, hasWarning = false, hasSuccessWarning = false, all = false) {
    return Observable.create((sub) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      NProgress.start();
      this.http.delete(this.getFullUrl(url), {
        withCredentials: true,
        headers: headers
      }).subscribe({
        next: (res) => {
          NProgress.done();
          const data = res.json();
          this.codeHandler(data);
          if (data.code === 200) {
            if (hasSuccessWarning) {
              iziToast.success({
                position: 'topRight',
                title: 'success!',
                message: `${data.message}`
              });
            }
            if (all) {
              sub.next(data);
            }else {
              sub.next(data.data);
            }
          } else {
            if (hasWarning) {
              iziToast.error({
                position: 'topRight',
                title: '请求错误!',
                message: `${data.message}`
              });
            }
            sub.error(data);
          }
          sub.complete();
        },
        error: (err) => {
          NProgress.done();
          if (hasWarning) {
            iziToast.error({
              position: 'topRight',
              title: '请求错误!',
              message: url,
            });
          }
          sub.error(err);
          sub.complete();
          this.errorHandler(err);
        }
      });
    });
  }

  getFullUrl(url) {
    const debuggerId = this.debuggerServer.getSimulationUser();
    if ( debuggerId ) {
      if (url.indexOf('.com') > 0 ) {
        return url + '?debugger=' + debuggerId;
      }else {
        return /^(?:\/\/)/.test(url) ? url + '?debugger=' + debuggerId : this.apiUrl + url + '?debugger=' + debuggerId;
      }
    }else {
      if (url.indexOf('.com') > 0 ) {
        return url;
      }else {
        return /^(?:\/\/)/.test(url) ? url : this.apiUrl + url;
      }
    }

  }

  /**
   * 返回值处理
   * @param res
   * @returns {any}
   */
  codeHandler(res) {
    if (typeof res.code !== 'undefined') {
      // 单点登录模式, 未登录返回-14
      if (res.code === -14) {
        window.location.href = res.data;
      } else if (res.code !== 200 && res.code !== 401) {
        console.log('请求返回码错误，返回数据：', res);
      }
    } else {
      console.error('服务器返回值错误，未返回状态码，返回数据：', res);
    }
  }

  /**
   * http 请求发生错误处理
   */ 
  errorHandler(err) {
    NProgress.done();
    console.error('http请求出错：', err);
  }

  /**
   * 对文件格式进行处理
   * @param params
   * @param file
   * @returns {FormData}
   */
  fileData(params, file) {
    const data = new FormData();
    data.append('file', file);
    for (const index in params) {
      if (params.hasOwnProperty(index)) {
        data.append(index, params[index]);
      }
    }
    return data;
  }
  /**
   * 将对象格式化为 Url 键值对形式
   * @param data
   * @param isGet
   * @returns {string}
   */
  formatData(data, isGet?) {
    if (!data) {
      return '';
    }
    const queryStr = [];
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (typeof value !== 'undefined' && value !== '' && value !== null) {
        if (typeof value === 'object') {
          if (Array.isArray(value)) {
            // if (value.length > 0) {
            queryStr.push(encodeURIComponent(key) + '=' + encodeURIComponent(JSON.stringify(value)));
            // }
          } else if (value instanceof Date) {
            queryStr.push(encodeURIComponent(key) + '=' + this.getDateStr(value));
          } else {
            let count = 0;
            Object.keys(value).forEach((subKey) => {
              count++;
              if (value[subKey] instanceof  Date) {
                value[subKey] = this.getDateStr(value[subKey]);
              }
            });
            if (count > 0) {
              queryStr.push(encodeURIComponent(key) + '=' + encodeURIComponent(JSON.stringify(value)));
            }
          }
        } else {
          queryStr.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        }
      }
    });
    if (isGet) {
      return '?' + queryStr.join('&');
    } else {
      return queryStr.join('&');
    }
  }

  /**
   * 获取日期字符串
   * @param date
   * @returns {string}
   */
  getDateStr(date) {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;
  }
}
