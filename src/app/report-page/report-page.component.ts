import { Component, OnInit, OnDestroy } from '@angular/core';
import {ReportPageService} from '../core/services/report-page.service';
import {GlobalDataService} from '../core/global-data.service';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.scss']
})
export class ReportPageComponent implements OnInit, OnDestroy {
  headerCompList = [];
  panelCompList = [];
  pid;
  bid;
  // 是否显示编辑按钮  对普通用户不可见
  showConfigBtn: Boolean = false;

  constructor(private reportPageService: ReportPageService, private router: Router, private globalDataService: GlobalDataService,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe( () => {
      this.globalDataService.resetQueryParams();
      // 管理员和超级管理员则显示编辑按钮
      this.showConfigBtn = this.globalDataService.getParams().userInfo.role != 'user';
      this.initData();
    });
  }

  initData() {
    this.headerCompList = [];
    this.panelCompList = [];
    const temp_ = window.location.pathname.split('/');
    this.pid = parseInt(temp_[temp_.length - 1], 10);
    this.bid = parseInt(temp_[temp_.length - 2], 10);
    this.reportPageService.getPageData(this.pid).subscribe((succData) => {

      // 处理全局过滤条件，将后端接口字段转为前端自己需要的字段
      succData.global_filters.forEach((item) => {
        let data;
        if (item.stype == 'flatpickr') {
          data = {'type': 'flatpickr', 'mode': item.condition_type, 'timeType': item.conditions.split('_')[0] || 2,
            'otherTime': item.conditions.split('_')[1] || '', 'id': item.id, 'cname': item.cname, 'ename': item.ename,
          'cascades': item.cascades};
        }else if (item.stype == 'singleSelect' || item.stype == 'multiSelect') {
          data = { 'id': item.id, 'type': item.stype, 'cname': item.cname, 'ename': item.ename, 'sourceType': item.condition_type,
            'list': item.condition_type == 'dict' ? item.conditions : [], 'cascades': item.cascades,
            'db': item.db_source || '', 'sql': item.condition_type == 'dict' ? '' : item.conditions};
        }
        this.headerCompList.push(data);
      });

      // 储存页面的全局过滤条件数量，之后需要这个数量来判断是否全局条件数据都加载完毕
      this.globalDataService.setQueryParamsNum(this.headerCompList.length);

      // 处理全局过滤条件，将后端接口字段转为前端自己需要的字段
      succData.panels.forEach((item) => {
        let data;
        item.filters.forEach((item_, index) => {
          if (item_.stype == 'flatpickr') {
            data = {'type': 'flatpickr', 'mode': item_.condition_type, 'timeType': item_.conditions.split('_')[0] || 2,
              'otherTime': item_.conditions.split('_')[1] || '', 'id': item_.id, 'cname': item_.cname, 'ename': item_.ename,
              'cascades': item_.cascades};
          }else if (item_.stype == 'singleSelect' || item_.stype == 'multiSelect') {
            data = { 'id': item_.id, 'type': item_.stype, 'cname': item_.cname, 'ename': item_.ename, 'sourceType': item_.condition_type,
              'list': item_.condition_type == 'dict' ? item_.conditions : [], 'cascades': item_.cascades,
              'db': item_.db_source || '', 'sql': item_.condition_type == 'dict' ? '' : item_.conditions};
          }
          item.filters[index] = data;
        });
      });
      this.panelCompList = succData.panels;
    });
  }

  // 跳转到报表配置页面
  editPage() {
    this.router.navigateByUrl('/reportConfig/' + this.bid + '/' + this.pid);
  }

  ngOnDestroy() {
    this.globalDataService.resetQueryParams();
  }

}
