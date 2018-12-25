import { Component, OnInit, ViewChild } from '@angular/core';
import {ConfirmationService} from '../primeng/components/common/api';
import {BusinessConfigService} from '../core/services/business-config.service';
import {UserListService} from '../core/services/user-list.service';
import {GlobalDataService} from '../core/global-data.service';
import { ConfigService } from '../core/services/config.service';
import {Router} from '@angular/router';
const iziToast = require('izitoast');

@Component({
  selector: 'app-business-config',
  templateUrl: './business-config.component.html',
  styleUrls: ['./business-config.component.scss']
})
export class BusinessConfigComponent implements OnInit {

  // 用户信息
  userInfo = {
    'avatar': '',
    'name': '',
    'id': '',
    'role': ''
  };

  // 业务列表
  businessList = {
    'my_bussiness': [],
    'other_bussiness': []
  };

  // 业务信息
  businessInfo = {
    'id': '',
    'name': '',
    'description': '',
    'managers': []
  };

  // 业务数据库列表
  dbList = [];

  // 数据库信息
  dbInfo = {
    'dtype': '',
    'name': '',
    'ip': '',
    'port': '',
    'user': '',
    'password': ''
  };

  // 业务编辑类型 0：新增  1：编辑
  businessEditType = 0;

  // 业务数据库编辑类型 0：新增  1：编辑
  dbEditType = 0;

  // 当前编辑的index序号
  currentEditIndex = 0;

  // 数据库类型列表
  dbTypeList = [];

  // 用户列表
  userList = [];

  // 当前步骤
  currentStep = 0;

  // 显示业务编辑弹窗
  isShowEditdialog = false;

  // 显示数据库编辑弹窗
  isShowDbEditdialog = false;

  // 是否显示密码
  isShowPassword = false;

  // 是否显示业务列表
  isShowData = false;


  constructor(private businessConfigService: BusinessConfigService, private confirmationService: ConfirmationService,
              private globalDataService: GlobalDataService, private userListService: UserListService, private router: Router,
              private configService: ConfigService) { }

  ngOnInit() {
    this.userInfo = this.globalDataService.getParams().userInfo;
    this.getBusinessList();
    this.getUserList();
  }

  // 获取业务列表
  getBusinessList() {
    this.businessConfigService.getBusinessList().subscribe((listData) => {
      this.businessList = listData;
      this.isShowData = true;
    });
  }

  getUserList() {
    // 业务管理员和超级管理员有编辑权限，编辑业务需要系统用户列表
    this.userListService.getSysUserList().subscribe((userList) => {
      this.userList = userList;
    });
  }

  // 删除业务
  clearBusiness(item, index) {
    event.stopPropagation();
    this.confirmationService.confirm({
      message: `删除之后不可恢复，确认删除吗？`,
      accept: () => {
        this.businessConfigService.deleteBusiness( item.id ).subscribe( (succData) => {
          this.businessList.my_bussiness.splice(index, 1);
          iziToast.success({
            position: 'topRight',
            title: '请求成功!',
            message: `业务删除成功`,
          });
        });
      }
    });
  }

  // 新增业务
  addBusiness() {
    this.businessInfo = {
      'id': '',
      'name': '',
      'description': '',
      'managers': []
    };
    this.businessEditType = 0;
    this.isShowEditdialog = true;
  }

  // 编辑业务
  editBusiness(item) {
    event.stopPropagation();
    this.businessInfo = {
      'id': '',
      'name': '',
      'description': '',
      'managers': []
    };
    this.businessInfo['managers_old'] = {};
    item.managers.forEach(( user, index ) => {
      this.businessInfo['managers'].push(user.user_id);
      this.businessInfo['managers_old'][user.user_id] = {'id': user.id, 'user_id': user.user_id, 'status': -1};
    });
    this.businessInfo['name'] = item.name;
    this.businessInfo['description'] = item.description;
    this.businessInfo['id'] = item.id;
    this.businessEditType = 1;
    this.isShowEditdialog = true;
  }

  // 隐藏弹窗
  dialogHide(type) {
    if ( type == 1) {
      this.isShowEditdialog = false;
      this.currentStep = 0;
      this.dbList = [];
    }else if ( type == 2 ) {
      this.isShowEditdialog = true;
      this.isShowDbEditdialog = false;
    }
  }

  // 返回上一步
  goBack() {
    this.currentStep = this.currentStep > 0 ? this.currentStep - 1 : 0;
  }

  // 下一步
  goNext() {
    if ( this.currentStep == 0 ) {
      const keys = Object.keys(this.businessInfo);
      for ( let i = 0; i < keys.length; i++) {
        if (keys[i] != 'id' && keys[i] != 'managers_new' && this.businessInfo[keys[i]].length === 0) {
          iziToast.error({
            position: 'topRight',
            title: '填写错误!',
            message: `表格各项不能为空`
          });
          return false;
        }
      }
      const temp = this.businessInfo.managers, temp_ = [];
      // 处理管理员数据
      for (let i = 0; i < this.userList.length; i++) {
        const item = this.userList[i];
        if (temp.indexOf(item.id) > -1 ) {
          if (this.businessEditType == 0) {
            temp_.push({'user_id': item.id, 'user_name': item.name});
          }else {
            if (this.businessInfo['managers_old'][item.id]) {
              temp_.push({'id': this.businessInfo['managers_old'][item.id].id, 'user_id': item.id, 'user_name': item.name});
            }else {
              temp_.push({'user_id': item.id, 'user_name': item.name});
            }
          }
          if (temp_.length == temp.length) {
            this.businessInfo['managers_new'] = temp_;
            if (this.businessInfo['managers_old']) {
              Object.keys(this.businessInfo['managers_old']).forEach( (key, index) => {
                if (this.businessInfo['managers'].indexOf(parseInt(key, 10)) == -1) {
                  this.businessInfo['managers_new'].push(this.businessInfo['managers_old'][key]);
                }
              });
            }
            break;
          }
        }
      }
      if (this.businessEditType == 1) {
        this.businessConfigService.getDbList( this.businessInfo.id ).subscribe( (listData) => {
          this.dbList = listData;
        });
      }
    }else if (this.currentStep == 1) {
      if (this.dbList.length === 0) {
        iziToast.error({
          position: 'topRight',
          title: '提交错误!',
          message: `请至少添加一项数据库`
        });
        return false;
      }
    }
    this.currentStep = this.currentStep < 2 ? this.currentStep + 1 : 2;
  }

  // 结束
  finish() {
    const businessInfo = JSON.parse(JSON.stringify(this.businessInfo));
    businessInfo['managers'] = businessInfo['managers_new'];
    delete businessInfo['managers_new'];
    delete businessInfo['managers_old'];
    if ( this.businessEditType == 0 ) {
      delete (businessInfo.id);
    }

    this.businessConfigService.editBusiness(businessInfo).subscribe((succData) => {
      this.businessConfigService.editDbList(succData.bussiness_id, this.dbList).subscribe((data) => {
        iziToast.success({
          position: 'topRight',
          title: '请求成功!',
          message: `业务操作成功`
        });
        this.currentStep = 0;
        this.dbList = [];
        this.isShowEditdialog = false;
        this.getBusinessList();
      }, (error) => {
        iziToast.error({
          position: 'topRight',
          title: '请求失败!',
          message: `业务数据库添加失败`
        });
      });
    }, (error) => {
      iziToast.error({
        position: 'topRight',
        title: '请求失败!',
        message: `业务添加失败`
      });
    });
  }

  // 新增数据库
  dbAdd() {
    this.businessConfigService.getDbTypeList().subscribe( (listData) => {
      this.dbTypeList = listData;
      this.dbInfo = {
        'dtype': '',
        'name': '',
        'ip': '',
        'port': '',
        'user': '',
        'password': ''
      };
      this.dbEditType = 0;
      this.isShowPassword = false;
      this.isShowEditdialog = false;
      this.isShowDbEditdialog = true;
    });
  }

  // 编辑数据库
  dbEdit(item, index) {
    this.businessConfigService.getDbTypeList().subscribe( (listData) => {
      this.dbTypeList = listData;
      this.dbInfo = item;
      this.dbEditType = 1;
      this.currentEditIndex = index;
      this.isShowPassword = false;
      this.isShowEditdialog = false;
      this.isShowDbEditdialog = true;
    });
  }

  // 删除数据库
  dbDelete(item, index) {
    this.dbList[index]['status'] = -1;
  }

  // 确定添加业务数据库
  commit() {
      const dbKeys = Object.keys(this.dbInfo);
      for (let i = 0; i < dbKeys.length; i++) {
        if ( dbKeys[i] != 'id' && this.dbInfo[dbKeys[i]].length === 0 ) {
          iziToast.error({
            position: 'topRight',
            title: '填写错误!',
            message: `表格各项不能为空`
          });
          return false;
        }
      }
      this.dbEditType == 0 ? this.dbList.push( this.dbInfo ) : this.dbList[this.currentEditIndex] = this.dbInfo;
      this.dialogHide(2);
  }

  // 测试数据库连接
  testConnect() {
    this.businessConfigService.testDbconnect( this.dbInfo ).subscribe( (succData) => {
      iziToast.success({
        position: 'topRight',
        title: '请求成功!',
        message: `数据库连接测试成功`
      });
    }, (error) => {
      iziToast.error({
        position: 'topRight',
        title: '请求失败!',
        message: `数据库连接测试失败，请检查配置`
      });
    });
  }

  // 下拉列表选中变化时触发
  onSelectedChange(event) {
    this.dbInfo.dtype = event.value;
  }

  // 显示或隐藏密码
  changeInputType() {
    this.isShowPassword = !this.isShowPassword;
  }

  // 跳转
  jumpPage(item) {
    this.configService.selectBusiness( {'bussiness_id': parseInt(item.id, 10)} ).subscribe( (succDate) => {
          this.configService.getUserMenu().subscribe( (menuData) => {
            this.businessConfigService.setBusinessId(item.id);
            this.businessConfigService.setBusinessName(item.name);
            if (menuData.length == 0) {
              this.configService.setPathName('/noPage/' + item.id);
              window.location.href = '/';
            }else {
              this.configService.setPathName('/reportPage/' + item.id + '/' + this.checkMenu(menuData[0]));
              window.location.href = '/';
            }
          });
      },
      (error) => {
        iziToast.error({
          position: 'topRight',
          title: '请求失败!',
          message: `业务跳转失败，请联系管理员`
        });
      }
    );
  }

  checkMenu(menu) {
    if (menu.sub_menus && menu.sub_menus.length > 0) {
      return this.checkMenu(menu.sub_menus[0]);
    }else {
      return menu.id;
    }
  }
}
