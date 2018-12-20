import {Component, OnInit, ViewChild} from '@angular/core';
import { UserListService } from '../core/services/user-list.service';
import {ConfirmationService} from '../primeng/components/common/api';
import {GlobalDataService} from '../core/global-data.service';
import {ConfigService} from '../core/services/config.service';
import {Router} from '@angular/router';
const iziToast = require('izitoast');

@Component({
  selector: 'app-sys-user-list',
  templateUrl: './sys-user-list.component.html',
  styleUrls: ['./sys-user-list.component.scss']
})
export class SysUserListComponent implements OnInit {
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
  // 错误信息
  updateErrorMsg = '';
  // 账号状态
  statusList = [{'value': -1, 'label': '不可用'}, {'value': 0, 'label': '未激活'}, {'value': 1, 'label': '正常使用'}];
  // 当前操作的项的序号
  curIndex = 0;
  // 账号的类型
  userTypeList = [{'value': 'user', 'label': '普通用户'}, {'value': 'admin', 'label': '业务管理员'},
    {'value': 'super_admin', 'label': '超级管理员'}];
  // 暂存账号类型
  userTypeTemp: string;

  constructor(private userListService: UserListService, private router: Router,
              private confirmationService: ConfirmationService, private globalDataService: GlobalDataService,
              private configService: ConfigService) { }

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

  // 显示编辑弹窗
  userEdit(item, index) {
    this.curIndex = this.pageRows * this.curPage + index;
    this.userInfo = Object.assign({}, item);
    this.dialogVisible = true;
  }

  // 删除用户账号
  userDelete(item, index) {
    this.confirmationService.confirm({
      message: `确认删除用户 ${item.name + ' (' + item.account + ')'} 吗？`,
      accept: () => {
        this.userListService.deleteSysUser( item.id ).subscribe( (succData) => {
          this.userList.splice(this.pageRows * this.curPage + index, 1);
          this.pageList = this.userList.slice(this.pageRows * this.curPage, this.pageRows * ( this.curPage + 1) );
        });
      }
    });
  }

  // 更新系统用户信息
  userUpdate() {
    this.userListService.editSysUser( this.userInfo.id,
      {'email': this.userInfo.email , 'status': this.userInfo.status , 'role': this.userTypeTemp} )
      .subscribe((succData) => {
        this.userList[ this.curIndex ] = Object.assign({}, succData);
        this.pageList[ this.curIndex - this.pageRows * this.curPage ] = Object.assign({}, succData);
        this.dialogVisible = false;
      }, (err) => {
        iziToast.error({
          position: 'topRight',
          title: '请求错误!',
          message: `信息更新失败`,
        });
        this.dialogVisible = false;
      });
  }

  // 隐藏编辑弹窗
  dialogHide() {
    this.dialogVisible = false;
  }

  // 页码改变
  changePages(event) {
    this.curPage = event.page;
    this.pageList = this.userList.slice(this.pageRows * event.page, this.pageRows * ( event.page + 1) );
  }

  // 下拉列表选中变化时触发
  onSelectedChange(event) {
    this.userTypeTemp = event.value;
  }
}
