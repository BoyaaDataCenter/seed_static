import { Component, OnInit } from '@angular/core';
import {ResetPasswordService} from '../core/services/reset-password.service';
import {ConfirmationService} from '../primeng/components/common/api';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  errorMsg =  '';
  account =  '';
  password =  '';
  confirm_password = '';

  showType = 1;  // 1：重置密码申请  2：重置密码
  token;

  constructor(private resetPasswordService: ResetPasswordService, private router: Router,
              private confirmationService: ConfirmationService) { }

  ngOnInit() {
    const location = window.location;
    if (location.search) {
      this.showType = 2;
      let url = location.href.split('?')[1].split('&');
      this.token = url[1].split('=')[1];
    }else {
      this.showType = 1;
    }
  }

  // 重置请求
  resetApply() {
    if (this.account == '') {
      this.errorMsg = '请先输入账号名或者邮箱~';
      return false;
    }
    const location = window.location;
    this.resetPasswordService.userResetApply({'account': this.account,
      'reset_url': location.protocol + '//' + location.host + '/resetPassword'}).subscribe(
      (succData) => {
        this.confirmationService.confirm({
          message: `我们已经给您的邮箱发送了一份确认邮件，请前往邮箱查看吧`,
          accept : () => {}
        });
      },
      (error) => {
        this.errorMsg = error.message || '请求失败，请核对所填信息是否正确';
    });
  }

  // 重置密码
  resetPassword() {
    if (this.password == '') {
      this.errorMsg = '请先输入密码~';
      return false;
    }else if (this.confirm_password == '') {
      this.errorMsg = '请先输入确认密码~';
      return false;
    }else if (this.password != this.confirm_password) {
      this.errorMsg = '两次输入的密码不同！';
      return false;
    }else if (this.password.length < 6 || this.password.length > 16) {
      this.errorMsg = '密码位数只能在6-16位之间~';
      return false;
    }

    const param = {
      'password': this.password,
      'confirm_password': this.confirm_password,
      'reset_token': this.token
    };
    this.resetPasswordService.userResetPassword(param).subscribe((succData) => {
        this.confirmationService.confirm({
          message: `重置密码成功，是否跳转到登录页面`,
          accept : () => {
            this.goToLogin();
          }
        });
      },
      (error) => {
        this.errorMsg = error.message || '重置失败，请核对所填信息是否正确';
      }
    );
  }

  inputStart() {
    this.errorMsg = '';
  }

  // 去登陆
  goToLogin() {
    this.router.navigateByUrl('/login');
  }

}
