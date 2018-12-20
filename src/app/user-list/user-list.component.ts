import { Component, OnInit } from '@angular/core';
import { UserListService } from '../core/services/user-list.service';
import {ConfirmationService} from '../primeng/components/common/api';
import {GlobalDataService} from '../core/global-data.service';
import {Router} from '@angular/router';
const iziToast = require('izitoast');

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  // 用户列表
  userList = [];
  // 当前页码
  curPage = 0;
  // 每页显示多少行数据
  pageRows = 15;
  // 显示的数据
  pageList = [];
  // 用户账号信息
  userInfo = {
    account: '',
    avatar: '',
    created: '',
    depart_id: '',
    email: '',
    id: '',
    login_at: '',
    name: '',
    role: '',
    sex: '',
    sso_id: '',
    status: ''
  };
  // 是否显示弹窗
  dialogVisible = false;
  // 当前操作的项的序号
  curIndex = 0;
  // 是否有超级管理员权限
  hasPower: boolean;
  // 业务id
  bid;
  // 新增用户ID
  newUserListId = [];
  // 系统用户列表
  sysUserList = [];
  // 业务角色列表
  roleList = [];

  // 显示用户角色编辑弹窗
  roleDialogVisible = false;

  // 储存用户的角色id
  roleIdList = [];

  currentUserId;

  constructor(private userListService: UserListService, private router: Router,
              private confirmationService: ConfirmationService, private globalDataService: GlobalDataService) { }

  ngOnInit() {
    const userRole = this.globalDataService.getParams().userInfo;
    this.hasPower = userRole.role == 'super_admin';
    const temp_ = window.location.pathname.split('/');
    this.bid = parseInt(temp_[2], 10);
    this.getUserList();
  }

  // 获取业务用户列表
  getUserList() {
    this.userListService.getBusUserList(this.bid).subscribe((listData) => {
      this.userList = listData;
      this.pageList = this.userList.slice(0, this.pageRows);
    });
  }

  // 获取业务角色列表
  getRoleList() {
    this.roleList = [];
    this.userListService.getRoleList().subscribe((listData) => {
      listData.forEach((item) => {
        this.roleList.push({'value': item.id, 'label': item.role});
      });
      this.roleDialogVisible = true;
    });
  }

  // 隐藏编辑弹窗
  dialogHide() {
    this.dialogVisible = false;
    this.roleDialogVisible = false;
  }

  // 删除用户账号
  userDelete(item, index) {
    this.confirmationService.confirm({
      message: `确认删除用户 ${item.name + ' (' + item.account + ')'} 吗？`,
      accept: () => {
        this.userListService.deleteBusUser( item.id ).subscribe( (succData) => {
          this.userList.splice(this.pageRows * this.curPage + index, 1);
          this.pageList = this.userList.slice(this.pageRows * this.curPage, this.pageRows * ( this.curPage + 1) );
        });
      }
    });
  }

  // 储存编辑对象信息
  userEdit(item, index) {
    this.roleIdList = [];
    item.brole.forEach((item_) => {
      this.roleIdList.push(item_.id);
    });
    this.currentUserId = item.id;
    this.curIndex = index;
    this.getRoleList();
  }

  // 添加业务用户
  addSysUser() {
    this.newUserListId = [];
    this.userListService.getOtherSysUserList().subscribe((listData) => {
      this.sysUserList = listData;
      this.dialogVisible = true;
    });
  }

  // 确定添加业务用户
  userListUpdate() {
      let busUserList = [];
      this.newUserListId.forEach((item) => {
        busUserList.push({'bussiness_id': this.bid, 'user_id': item});
      });
      this.userListService.addBusUser(busUserList).subscribe((succData) => {
        this.getUserList();
        this.dialogHide();
      }, (err) => {
        iziToast.error({
          position: 'topRight',
          title: '请求失败!',
          message: `业务用户添加失败`,
        });
      });
  }

  // 页码改变
  changePages(event) {
    this.curPage = event.page;
    this.pageList = this.userList.slice(this.pageRows * event.page, this.pageRows * ( event.page + 1) );
  }

  // 更新用户角色
  userRoleUpdate() {
    let data = [];
    this.roleIdList.forEach((id) => {
      data.push({'role_id': id, 'user_id': this.currentUserId});
    });
    this.userListService.setUserRole(this.currentUserId, data).subscribe(
      (succData) => {
        let roleData = [];
        succData.forEach((item) => {
          roleData.push({'id': item.role_id, 'role': item.role});
        });
        this.userList[this.pageRows * this.curPage + this.curIndex].brole = roleData;
        this.pageList[this.curIndex].brole = roleData;
        this.dialogHide();
      },
      (error) => {
        iziToast.error({
          position: 'topRight',
          title: '请求失败!',
          message: `用户角色保存失败`,
        });
      });
  }

}
