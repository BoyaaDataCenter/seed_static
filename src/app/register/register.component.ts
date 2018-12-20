import { Component, OnInit } from '@angular/core';
import {LoginService} from '../core/services/login.service';
import {Router} from '@angular/router';
const iziToast = require('izitoast');


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  errorMsg =  '';
  account =  '';
  password =  '';
  confirm_password = '';
  email = '';
  name = '';

  showType = 1;  // 1：注册  2：注册结果
  token;


  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    const location = window.location;
    if (location.href.split('?').length > 1) {
      this.showType = 2;
      let url = location.href.split('?')[1].split('&');
      this.token = url[1].split('=')[1];
      this.confirm();
    }else {
      this.showType = 1;
    }
  }

  userRegister() {
    if (this.name == '') {
      this.errorMsg = '请先输入姓名~';
      return false;
    }else if (this.email == '') {
      this.errorMsg = '请先输入邮箱~';
      return false;
    }else if (this.account == '') {
      this.errorMsg = '请先输入账号名~';
      return false;
    }else if (this.password == '') {
      this.errorMsg = '请先输入密码~';
      return false;
    }else if (this.password.length < 6 || this.password.length > 16) {
      this.errorMsg = '密码位数只能在6-16位之间~';
      return false;
    }else if (this.confirm_password == '') {
      this.errorMsg = '请先输入确认密码~';
      return false;
    }

    if (this.password != this.confirm_password) {
      this.errorMsg = '两次输入的密码不同！';
      return false;
    }

    const location = window.location;
    const param = {
      'account': this.account,
      'password': this.password,
      'confirm_password': this.confirm_password,
      'email': this.email,
      'name': this.name,
      'active_url': location.protocol + '//' + location.host + '/register'
    };
    this.loginService.userRegister(param).subscribe((succData) => {
        iziToast.success({
          position: 'topRight',
          title: '注册成功!',
          message: `即将跳转到登录页`,
          timeout: 1500
        });
        setTimeout(() => {
          this.goToLogin();
        }, 2000);
      },
      (error) => {
        this.errorMsg = error.message;
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

  // 激活用户
  confirm() {
    this.loginService.userActive('/users/active_account', {'active_token': this.token}).subscribe(() => {});
  }

}
