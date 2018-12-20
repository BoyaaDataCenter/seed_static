import { Injectable } from '@angular/core';
import {FetchService} from './fetch.service';

@Injectable()
export class KeyDataService {

  constructor(private fetch: FetchService) { }

  /**
   * 关键数据
   * @param params
   * @param url
   * @returns {Observable<any>}
   */
  getKeyData(params, url) {
    return this.fetch.get(url ? url : 'common/', Object.assign({ charttype: 'key' }, params));
  }
}
