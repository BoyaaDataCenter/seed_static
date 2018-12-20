import { Injectable } from '@angular/core';
import {FetchService} from './fetch.service';

@Injectable()
export class ReportPageService {
  constructor(private fetch: FetchService) { }

  /**
   * 获取报表页面数据
   * @returns {Observable<any>}
   */
  getPageData(pid) {
    return this.fetch.get('/endpoints/pages/' + pid, null);
  }

}
