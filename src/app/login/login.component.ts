import { Component, OnInit } from '@angular/core';
import {LoginService} from '../core/services/login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorMsg =  '';
  account =  '';
  password =  '';

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
  }

  userLogin() {
    this.loginService.userLogin({'account': this.account, 'password': this.password}).subscribe((succData) => {
      window.location.href = '/';
    },
    (error) => {
        this.errorMsg = '账号或密码输入错误';
    });
  }

  inputStart() {
    this.errorMsg = '';
  }

  // 去注册
  goToRegister() {
    this.router.navigateByUrl('/register');
  }

  // 重置密码
  goToReset() {
    this.router.navigateByUrl('/resetPassword');
  }

}
