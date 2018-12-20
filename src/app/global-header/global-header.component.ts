import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {GlobalDataService} from '../core/global-data.service';
import {ConfigService} from '../core/services/config.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-global-header',
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.scss']
})
export class GlobalHeaderComponent implements OnInit, OnDestroy {
  @ViewChild('avatarImg') avatarImgDom;
  // 用户信息
  userInfo = {
    'avatar': '',
    'name': '',
    'id': '',
    'role': ''
  };
  opersList = {
    'userInfo': true,
    'goBack': true,
    'signOut': true
  };

  userInfoChange$;
  isSuperAdmin = false;

  constructor(private configService: ConfigService, private globalDataService: GlobalDataService,
              private router: Router) {
    this.userInfoChange$ = globalDataService.userInfoChange$.subscribe(() => {
      this.dealUserInfo();
    });
  }

  ngOnInit() {
    this.dealOpersList();
    this.dealUserInfo();
  }

  dealUserInfo() {
    this.userInfo = this.globalDataService.getParams().userInfo;
    this.isSuperAdmin = this.userInfo.role == 'super_admin';
    this.setAvatar();
  }

  dealOpersList() {
    const pathname = window.location.pathname.split('/')[1];
    if (pathname == 'businessConfig') {
      this.opersList['goBack'] = false;
    }else if (pathname == 'userInfo') {
      this.opersList['userInfo'] = false;
    }else if (pathname == 'sysUserList') {
      this.opersList['userInfo'] = false;
    }
  }

  // 设置头像
  setAvatar() {
    const imgDom = this.avatarImgDom.nativeElement;
    imgDom.src = this.userInfo.avatar || 'assets/images/avatar.jpg';
    imgDom.onerror = function () {
      imgDom.src = 'assets/images/avatar.jpg';
    };
  }

  // 退出登录
  signOut() {
    this.configService.loginOut().subscribe(() => {
      this.configService.clearBusinessInfo();
      this.router.navigateByUrl('/login');
    });
  }

  // 查看用户信息
  checkUserInfo() {
    this.router.navigateByUrl('/userInfo');
  }

  // 去到首页
  goIndex() {
    this.configService.clearBusinessInfo();
    this.router.navigateByUrl('/businessConfig');
  }

  // 查看系统用户
  checkSysUser() {
    this.router.navigateByUrl('/sysUserList');
  }

  // 返回上一页
  goBack() {
    window.history.go(-1);
  }

  ngOnDestroy() {
    if (this.userInfoChange$) {
      this.userInfoChange$.unsubscribe();
    }
  }

}
