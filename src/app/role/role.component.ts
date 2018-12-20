import { Component, OnInit } from '@angular/core';
import {ConfirmationService} from '../primeng/components/common/api';
import {RoleService} from '../core/services/role.service';
import {GlobalDataService} from '../core/global-data.service';
import {Router} from '@angular/router';
const iziToast = require('izitoast');

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  // 是否显示弹窗
  dialogVisible = false;
  // 用户列表
  roleList = [];
  roleInfo = {
    id: '',
    role: ''
  };
  // 当前页码
  curPage = 0;
  // 每页显示多少行数据
  pageRows = 15;
  // 显示的数据
  pageList = [];
  // 当前操作的项的序号
  curIndex = 0;
  // 编辑类型 1：新建 2：编辑
  editType: number;

  // 是否有权限
  hasPower: boolean;

  constructor(private roleService: RoleService, private confirmationService: ConfirmationService,
    private globalDataService: GlobalDataService, private router: Router) { }

  ngOnInit() {
    const userRole = this.globalDataService.getParams().userInfo;
    this.hasPower = userRole.role != 'user';
    this.getRoleList();
  }

  // 获取角色列表
  getRoleList() {
    if (!this.hasPower) {
      iziToast.error({
        position: 'topRight',
        title: '无权限!',
        message: `请先申请权限`,
      });
      return false;
    }
    this.roleService.getRoleList().subscribe((roleList) => {
      this.roleList = roleList;
      this.pageList = this.roleList.slice(this.pageRows * this.curPage, this.pageRows * ( this.curPage + 1) );
    });
  }

  // 操作角色
  operRole(type) {
    if (!this.hasPower) {
      iziToast.error({
        position: 'topRight',
        title: '无权限!',
        message: `请先申请权限`,
      });
      return false;
    }
    this.editType = type;
    this.roleInfo = {id: '', role: ''};
    this.dialogVisible = true;
  }

  // 显示编辑弹窗
  roleEdit(item, index) {
    this.curIndex = this.pageRows * this.curPage + index;
    this.roleInfo = Object.assign({}, item);
    this.dialogVisible = true;
  }

  // 删除用户账号
  roleDelete(item, index) {
    this.confirmationService.confirm({
      message: `确认删除用户 ${item.role} 吗？`,
      accept: () => {
        this.roleService.deleteRole( item.id ).subscribe( (succData) => {
          this.roleList.splice(this.pageRows * this.curPage + index, 1);
          this.pageList = this.roleList.slice(this.pageRows * this.curPage, this.pageRows * ( this.curPage + 1) );
        });
      }
    });
  }

  // 更新用户信息
  roleUpdate() {
    if ( this.editType == 1 ) {
      this.roleService.addRole({'role': this.roleInfo.role }).subscribe((succData) => {
        this.getRoleList();
        this.dialogHide();
      }, (err) => {
        iziToast.error({
          position: 'topRight',
          title: '请求错误!',
          message: `角色添加失败`,
        });
        this.dialogHide();
      });
    }else {
      this.roleService.editRole( this.roleInfo.id, {'role': this.roleInfo.role } ).subscribe((succData) => {
        this.roleList[ this.curIndex ] = Object.assign({}, succData);
        this.pageList[ this.curIndex - this.pageRows * this.curPage ] = Object.assign({}, succData);
        this.dialogHide();
      }, (err) => {
        iziToast.error({
          position: 'topRight',
          title: '请求错误!',
          message: `角色更新失败`,
        });
        this.dialogHide();
      });
    }
  }

  // 隐藏弹窗
  dialogHide() {
    this.dialogVisible = false;
    this.roleInfo = {id: '', role: ''};
    this.editType = 0;
  }

  // 页码改变
  changePages(event) {
    this.curPage = event.page;
    this.pageList = this.roleList.slice(this.pageRows * event.page, this.pageRows * ( event.page + 1) );
  }

  // 跳转到角色的菜单管理页面
  jumpToUserMenu(item) {
    this.globalDataService.setParams({ pageParam: {role_id : item.id}});
    // 手动路由跳转，路由参数
    this.router.navigateByUrl('/roleMenu/' + this.globalDataService.getBusinessId());
  }
}
