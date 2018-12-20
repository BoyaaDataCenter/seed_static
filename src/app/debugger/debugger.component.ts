import { Component, OnInit } from '@angular/core';
import { UserListService } from '../core/services/user-list.service';
import { DebuggerService } from '../core/debugger.service';
import {ConfirmationService} from '../primeng/components/common/api';
import {GlobalDataService} from '../core/global-data.service';
import {Router} from '@angular/router';
const iziToast = require('izitoast');

@Component({
  selector: 'app-debugger',
  templateUrl: './debugger.component.html',
  styleUrls: ['./debugger.component.scss']
})
export class DebuggerComponent implements OnInit {

  // 用户列表
  userList = [];
  // 当前页码
  curPage = 0;
  // 每页显示多少行数据
  pageRows = 15;
  // 显示的数据
  pageList = [];

  constructor(private userListService: UserListService, private router: Router, private debuggerService: DebuggerService,
              private confirmationService: ConfirmationService, private globalDataService: GlobalDataService) { }

  ngOnInit() {
    this.getUserList();
  }

  // 获取用户列表
  getUserList() {
    this.userListService.getSysUserList().subscribe((listData) => {
      this.userList = listData;
      this.pageList = this.userList.slice(0, this.pageRows);
    });
  }

  // 模拟用户
  simulateUser(userInfo) {
    this.debuggerService.simulateUser(userInfo.id);
    this.globalDataService.removeBusinessId();
    window.location.href = '/';
  }

  // 清除模拟用户
  clearSimulationUser() {
    this.debuggerService.clearSimulationUser();
    iziToast.success({
      position: 'topRight',
      title: '清除成功!',
      message: `即将自动刷新页面`,
    });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  // 跳转到首页
  jumpToIndex() {
    this.globalDataService.removeBusinessId();
    this.router.navigateByUrl('/businessConfig');
  }

  // 页码改变
  changePages(event) {
    this.curPage = event.page;
    this.pageList = this.userList.slice(this.pageRows * event.page, this.pageRows * ( event.page + 1) );
  }

}

