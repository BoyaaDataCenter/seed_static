import { Component, OnInit } from '@angular/core';
import {GlobalDataService} from '../core/global-data.service';
import {RoleMenuService} from '../core/services/role-menu.service';
import {RoleService} from '../core/services/role.service';
const iziToast = require('izitoast');

@Component({
  selector: 'app-role-menu',
  templateUrl: './role-menu.component.html',
  styleUrls: ['./role-menu.component.scss']
})
export class RoleMenuComponent implements OnInit {

  // 角色ID列表
  roleIdList = [];
  // 角色名称列表
  roleNameList = {};
  // 当前选中的角色;
  curSelected;
  // 水平显示指标的个数
  horizonNumber = 5;
  // 角色列表
  roleList;
  // 菜单列表
  menuList = [];
  show: boolean;

  // 是否有权限
  hasPower: boolean;

  constructor(private globalDataService: GlobalDataService, private roleMenuService: RoleMenuService, private roleService: RoleService) { }

  ngOnInit() {
    this.curSelected = this.globalDataService.getParams().pageParam.role_id;
    const userRole = this.globalDataService.getParams().userInfo;
    this.hasPower = userRole.role != 'user';
    if (!this.hasPower) {
      iziToast.error({
        position: 'topRight',
        title: '无权限!',
        message: `请先申请权限`,
      });
      return false;
    }
    this.getRoleList();

  }

  // 获取角色列表
  getRoleList() {
    this.roleService.getRoleList().subscribe((roleList) => {
      this.roleList = roleList;
      roleList.forEach((item) => {
        this.roleIdList.push({'value': item.id, 'label': item.role});
        this.roleNameList[item.id] = item.role;
      });
      this.show = true;
      if (!this.curSelected) {
        this.curSelected = this.roleIdList[0].value;
      }else {
        this.globalDataService.setParams({ pageParam: {role_id : ''}});
      }
      this.getRoleMenu();
    });
  }

  // 获取角色菜单列表
  getRoleMenu() {
      this.roleMenuService.getRoleMenuList( this.curSelected ).subscribe( (roleMuneList) => {
       this.menuList = roleMuneList;
      });

  }

  // 角色变换
  onSelected(id) {
    this.curSelected = id;
    this.getRoleMenu();
  }

  // 权限开关
  updateStatus(row, ...levelInfo) {
    let menuList = this.menuList;

    levelInfo.forEach((level, index) => {

      if (row.role_permission) {

        // 选中时，选中项目的祖先
        menuList[level]['role_permission'] = row.role_permission;
      } else {

        // 取消选中时，取消选中项目的子级
        if (index === levelInfo.length - 1) {
          menuList[level]['role_permission'] = row.role_permission;

          if (menuList[level]['sub_menus'] && menuList[level]['sub_menus'].length) {
            if (levelInfo.length === 1) {
              menuList[level]['sub_menus'].forEach((item) => {
                item['role_permission'] = row.role_permission;

                if (item['sub_menus'] && item['sub_menus'].length) {
                  item['sub_menus'].forEach(subItem => {
                    subItem['role_permission'] = row.role_permission;
                  });
                }
              });
            } else if (levelInfo.length === 2) {
              menuList[level]['sub_menus'].map((item) => {
                item['role_permission'] = row.role_permission;
              });
            }
          }
        }
      }

      if (index !== levelInfo.length - 1) {
        menuList = menuList[level]['sub_menus'];
      }
    });
  }

  // 处理子级
  dealSubItem(item, value) {
    if (item.sub_menus && item.sub_menus.length > 0) {
      item.sub_menus.forEach( (sub_menu) => {
        sub_menu.role_permission = value;
        this.dealSubItem(sub_menu, value);
      });
    }
  }

  // 保存菜单
  updateMenu() {
    if (!this.hasPower) {
      iziToast.error({
        position: 'topRight',
        title: '无权限!',
        message: `请先申请权限`,
      });
      return false;
    }
    this.roleMenuService.editRoleMenuList( this.curSelected, {'menu': this.menuList}).subscribe((succData) => {
        iziToast.success({
          position: 'topRight',
          title: '请求成功!',
          message: `角色菜单更新成功`,
        });
        this.globalDataService.onMenuChange();
    },
      (err) => {
        iziToast.error({
          position: 'topRight',
          title: '请求错误!',
          message: `角色菜单更新失败`,
        });
    });
  }

}
