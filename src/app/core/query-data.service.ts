import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

/**
 *
 * 主要用于传递级联的过滤组件数据
 */
@Injectable()
export class QueryDataService {

  // 如果级联组件的父组件值变化，需要先通知变化值
  private queryChange = new Subject<any>();
  queryChange$ = this.queryChange.asObservable();

  // 如果级联了某个父组件，需要父组件知道其子组件是谁
  private setQueryChild = new Subject<any>();
  setQueryChild$ = this.setQueryChild.asObservable();

  // 如果删除了组件，需要通知同级组件，如果其有父组件，应该让父组件删除两者的级联关系
  private deleteQuery = new Subject<any>();
  deleteQuery$ = this.deleteQuery.asObservable();

  constructor() { }

  /**
   * 页面查询条件变化，需要更新数据
   * @returns {any}
   */
  onQueryChange(data) {
    this.queryChange.next(data);
  }

  /**
   * 页面查询条件变化，需要更新数据
   * @returns {any}
   */
  onSetQueryChild(data) {
    this.setQueryChild.next(data);
  }

  /**
   * 页面查询条件变化，需要更新数据
   * @returns {any}
   */
  onDeleteQuery(data) {
    this.deleteQuery.next(data);
  }
}
