import {Component, OnInit, ViewChild} from '@angular/core';
import {GlobalDataService} from '../core/global-data.service';
import {ConfigService} from '../core/services/config.service';

import {Router} from '@angular/router';

@Component({
  selector: 'app-sys-header',
  templateUrl: './sys-header.component.html',
  styleUrls: ['./sys-header.component.scss']
})
export class SysHeaderComponent implements OnInit {
  @ViewChild('avatarImg') avatarImgDom;

  // 是否是系统管理员（超级管理员）
  isSuperAdmin = false;
  // 用户信息
  userInfo;
  // 业务id
  bid;

  constructor(private globalDataService: GlobalDataService, private router: Router,
              private configService: ConfigService) { }

  ngOnInit() {
    const temp_ = window.location.pathname.split('/');
    this.bid = parseInt(temp_[2], 10);
    this.userInfo = this.globalDataService.getParams().userInfo;
    this.isSuperAdmin = this.userInfo.role == 'super_admin';
    this.setAvatar();
  }

  checkSysUser() {
    this.router.navigateByUrl('/sysUserList');
  }

  // 查看用户信息
  checkUserInfo() {
    this.router.navigateByUrl('/userInfo');
  }

  // 退出登录
  signOut() {
    this.configService.loginOut().subscribe(() => {
      this.configService.clearBusinessInfo();
      this.router.navigateByUrl('/login');
    });
  }

  // 设置头像
  setAvatar() {
    const imgDom = this.avatarImgDom.nativeElement;
    imgDom.src = this.userInfo.avatar || 'assets/images/avatar.jpg';
    imgDom.onerror = function () {
      imgDom.src = 'assets/images/avatar.jpg';
    };
  }

}
