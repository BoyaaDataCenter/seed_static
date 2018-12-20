import { Component, OnInit } from '@angular/core';
import {ConfirmationService} from '../primeng/components/common/api';
import {MenuService} from '../core/services/menu.service';
import {GlobalDataService} from '../core/global-data.service';

const iziToast = require('izitoast');
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  // 菜单列表
  menuList: any[] = [];
  // 菜单详情
  menuInfo;
  menuInfoTemp;
  // 层级
  levelInfo;
  // 是否是在编辑菜单 true:编辑  false:新建
  isMenuEdit: boolean;
  // 是否显示菜单
  dialogVisible = false;
  // newMenuList: any[] = [];
  sortable;
  dragOrderInfo: any[] = [];
  dropOrderInfo: any[] = [];

  // 是否有权限
  hasPower: boolean;

  constructor(private menuService: MenuService, private confirmationService: ConfirmationService,
              private globalDataService: GlobalDataService) { }

  ngOnInit() {
    const userRole = this.globalDataService.getParams().userInfo;
    this.hasPower = userRole.role != 'user';
    this.getMune();
  }

  // 获取菜单
  getMune() {
    if (!this.hasPower) {
      iziToast.error({
        position: 'topRight',
        title: '无权限!',
        message: `请先申请权限`,
      });
      return false;
    }
    this.menuService.getMenuList().subscribe((menuList) => {
      this.menuList = menuList;
    });
  }

  // 更新菜单
  updateMenu() {
    if (!this.hasPower) {
      iziToast.error({
        position: 'topRight',
        title: '无权限!',
        message: `请先申请权限`,
      });
      return false;
    }
    this.menuService.editMenu( this.menuList ).subscribe( (succData) => {
      iziToast.success({
        position: 'topRight',
        title: '请求成功!',
        message: `菜单更新成功`,
      });
      this.menuList = succData;
      this.globalDataService.onMenuChange();
    }, (err) => {
      iziToast.error({
        position: 'topRight',
        title: '请求错误!',
        message: `菜单保存失败`,
      });
    });
  }

  // 排序
  sort(isUp: boolean, ...levelInfo) {
    const index = levelInfo[levelInfo.length - 1];
    let list    = this.menuList;
    levelInfo.forEach((level, i) => {
      if (i !== levelInfo.length - 1) {
        list = list[level]['sub_menus'];
      }
    });

    const sortList = list.reduce((rs, item, i) => {
      rs.push(i);
      return rs;
    }, []);
    if (isUp) {
      if (index === 0) {
        return false;
      } else {
        const temp          = sortList[index - 1];
        sortList[index - 1] = sortList[index];
        sortList[index]     = temp;
      }
    } else {
      if (index === list.length - 1) {
        return false;
      } else {
        const temp          = sortList[index + 1];
        sortList[index + 1] = sortList[index];
        sortList[index]     = temp;
      }
    }

    list.map((item, i) => {
      item['sort'] = sortList[i];
      return item;
    });

    list.sort((a, b) => {
      return a.sort - b.sort;
    });
  }

  // 编辑
  menuEdit(...levelInfo) {
    this.levelInfo = levelInfo;
    this.isMenuEdit = true;
    let menuList = this.menuList;
    levelInfo.forEach((level, index) => {
      if (index === levelInfo.length - 1) {
        this.menuInfo = Object.assign({}, menuList[level]);
      } else {
        menuList = menuList[level]['sub_menus'];
      }
    });

    this.dialogShow();
  }

  // 新增
  menuAdd(...levelInfo) {
    if (!this.hasPower) {
      iziToast.error({
        position: 'topRight',
        title: '无权限!',
        message: `请先申请权限`,
      });
      return false;
    }
    this.levelInfo = levelInfo;
    this.isMenuEdit = false;
    this.menuInfo = {'name': ''};
    this.dialogShow();
  }

  // 删除
  menuDelete(...levelInfo) {
    let menuList = this.menuList;
    levelInfo.forEach((level, index) => {
      if (index !== levelInfo.length - 1) {
        menuList = menuList[level]['sub_menus'];
      }
    });

    const current  = menuList[levelInfo[levelInfo.length - 1]];
    const children = current['sub_menus'];

    if (children && children.length) {
      let flag = true;
      children.forEach((item) => {
        if (item.status != -1) {
          flag = false;
          iziToast.error({
            position: 'topRight',
            title: '提示!',
            message: `请先删除子级菜单!`
          });
        }
      });
      if (flag) {
        this.confirmationService.confirm({
          message: `确认删除【${current.name}】？`,
          accept : () => {
            menuList[levelInfo[levelInfo.length - 1]]['status'] = -1;
          }
        });
      }
    } else {
      this.confirmationService.confirm({
        message: `确认删除【${current.name}】？`,
        accept : () => {
          menuList[levelInfo[levelInfo.length - 1]]['status'] = -1;
        }
      });
    }
  }

  // 确定编辑或新增
  enSure() {
    if (this.isMenuEdit) {
      let menuList = this.menuList;
      this.levelInfo.forEach((level, index) => {
        if (index === this.levelInfo.length - 1) {
          menuList[level] = this.menuInfo;
        } else {
          menuList = menuList[level]['sub_menus'];
        }
      });
    } else {
      let menuList = this.menuList;
      this.levelInfo.forEach((level) => {
        if (menuList[level]['sub_menus']) {
          menuList = menuList[level]['sub_menus'];
        } else {
          menuList = menuList[level]['sub_menus'] = [];
        }
      });
      menuList.push(this.menuInfo);
    }
    this.dialogHide();
  }

  // 隐藏编辑菜单框
  dialogHide() {
    this.dialogVisible = false;
  }

  // 显示编辑菜单框
  dialogShow() {
    this.dialogVisible = true;
  }

  ondragstart (ev, ...levelInfo) {
    /*拖拽开始*/
    this.dragOrderInfo = levelInfo;
    return true;
  }

  ondragend (ev) {
    /*拖拽结束*/
    return false;
  }

  ondragover (ev) {
    /*拖拽元素在目标元素头上移动的时候*/
    ev.preventDefault();
    return true;
  }

  ondragenter (ev) {
    /*拖拽元素进入目标元素头上的时候*/
    ev.currentTarget.classList.add('active');
    return true;
  }

  ondragleave (ev) {
    /*拖拽元素离开目标元素的时候*/
    ev.currentTarget.classList.remove('active');
    return true;
  }

  ondrop (ev, ...levelInfo) {
    /*拖拽元素进入目标元素头上，同时鼠标松开的时候*/
    ev.currentTarget.classList.remove('active');
    this.dropOrderInfo = levelInfo;
    let dropOrderStr = levelInfo.join('');
    let dragOrderStr = this.dragOrderInfo.join('');
    let dragType = 0;  // 拖拽类型 0：默认  1：从下往上（这种情况的时候比较特别）   2：从上往下
    let dropOrderLength = this.dropOrderInfo.length - 1;
    let dragOrderLength = this.dragOrderInfo.length - 1;
    if (dropOrderStr.substring(0, dropOrderLength) == dragOrderStr.substring(0, dragOrderLength)) {
      dragType = 1;
      if ( this.dropOrderInfo[dropOrderLength] > this.dragOrderInfo[dragOrderLength] ) {
        dragType = 2;
      }
    }

    let temp1 = this.menuList, temp2 = this.menuList, temp1_parent, temp2_parent;
    // 被拖拽元素
    this.dragOrderInfo.forEach((level, index) => {
      temp1 = index == 0 ? temp1[level] : temp1['sub_menus'][level];
      if ( this.dragOrderInfo.length == 1 ) {
        temp1_parent = this.menuList;
      }else if (index === this.dragOrderInfo.length - 2) {
        temp1_parent = temp1;
      }
    });
    // 目标元素
    this.dropOrderInfo.forEach((level, index) => {
      if ( this.dropOrderInfo.length == 1 ) {
        this.menuList.splice( this.dropOrderInfo[0], 0, temp1 );
      }else {
        temp2 = index == 0 ? temp2[level] : temp2['sub_menus'][level];
        if (index === this.dropOrderInfo.length - 2) {
          temp2['sub_menus'].splice( this.dropOrderInfo[dropOrderLength], 0, temp1 );
        }
      }
    });
    this.dragOrderInfo.length != 1 ? temp1_parent = temp1_parent['sub_menus'] : '';
    temp1_parent.splice( dragType == 1 ? this.dragOrderInfo[dragOrderLength] + 1 : this.dragOrderInfo[dragOrderLength], 1);
    return false;
  }
}
