import {Component, Injectable, OnInit, ViewChild} from '@angular/core';
import {GlobalDataService} from '../core/global-data.service';
import { UserInfoService } from '../core/services/user-info.service';
import {ConfigService} from '../core/services/config.service';
import {Router} from '@angular/router';
const iziToast = require('izitoast');
declare var jQuery: any;
@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
  @ViewChild('avatarImg') userAvatarImgDom;

  userInfo: {
    account: '',
    depart_id: '',
    email: '',
    id: '',
    name: '',
    role: '',
    sex: '',
    sso_id: '',
    status: '',
    avatar: '',
    roleList: '',
    created: '',
    login_at: '',
    brole: ''
  };

  roleList = [];

  sexList = {'male': '男', 'female': '女'};
  sexSelectList = [{'value': 'male', 'label': '男'}, {'value': 'female', 'label': '女'}];
  roleType = {'user': '普通用户', 'admin': '业务管理员', 'super_admin': '系统管理员'};

  isEditing = false;

  constructor(private userInfoService: UserInfoService, private globalDataService: GlobalDataService,
              private router: Router, private configService: ConfigService) { }

  ngOnInit() {
    this.userInfo = this.globalDataService.getParams().userInfo;
    this.setAvatar();
  }

  // 设置头像
  setAvatar() {
    const userImgDom = this.userAvatarImgDom.nativeElement;
    userImgDom.src = this.userInfo.avatar || 'assets/images/avatar.jpg';
    userImgDom.onerror = function () {
      userImgDom.src = 'assets/images/avatar.jpg';
    };
  }

  // 编辑用户信息状态，显示编辑框
  editUserInfo() {
    this.isEditing = true;
  }

  // 保存用户信息
  saveUserInfo(data?) {
    const data_ = data ? data : {'name': this.userInfo.name, 'email': this.userInfo.email, 'sex': this.userInfo.sex};
    this.userInfoService.setUserInfo( this.userInfo.id, data_).subscribe(
      (succData) => {
        this.userInfo = succData;
        this.globalDataService.setParams({ userInfo: this.userInfo });
        this.globalDataService.onUserInfoChange();
        this.isEditing = false;
        if (data) {
          this.setAvatar();
        }
      },
      (error) => {
        iziToast.error({
          position: 'topRight',
          title: '请求错误!',
          message: `信息更新失败`,
        });
      });
  }

  // 上传头像
  uploadImg(event) {
    jQuery('.upDateBtn #uploadImage').on('change', () => {
      const file = jQuery('#uploadImage')[0].files[0];
      let formData = new FormData();
      formData.append('file', file);
      this.userInfoService.setUserAvatar(formData).subscribe(
        (succData) => {
          this.saveUserInfo({'avatar': succData.file_url});
        },
        (error) => {
          iziToast.error({
            position: 'topRight',
            title: '请求错误!',
            message: `头像更新失败`,
          });
        });
        jQuery('.upDateBtn #uploadImage').off();
        jQuery('.upDateBtn #uploadImage').val('');
    });
  }

  // 退出登录
  signOut() {
    this.configService.loginOut().subscribe(() => {
      this.configService.clearBusinessInfo();
      this.router.navigateByUrl('/login');
    });
  }
}
