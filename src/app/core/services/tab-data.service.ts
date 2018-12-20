import { Injectable } from '@angular/core';
import {FetchService} from './fetch.service';

@Injectable()
export class TabDataService {

  constructor(private fetch: FetchService) { }

  /**
   * Tab data 服务
   * @param params
   * @param url
   * @returns {Observable<any>}
   */
  getData(query, url?) {
    if (!url) {
      url = 'common/dropdown/';
    }
    return this.fetch.get(url, query);
  }
}
