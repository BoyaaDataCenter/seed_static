import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserInfoComponent } from '../user-info/user-info.component';
import { UserListComponent } from '../user-list/user-list.component';
import { SysUserListComponent } from '../sys-user-list/sys-user-list.component';
import { MainComponent } from '../main/main.component';
import { RoleComponent } from '../role/role.component';
import { MenuComponent } from '../menu/menu.component';
import { DebuggerComponent } from '../debugger/debugger.component';
import { RoleMenuComponent } from '../role-menu/role-menu.component';
import { ReportPageComponent } from '../report-page/report-page.component';
import { ReportConfigComponent } from '../report-config/report-config.component';
import { BusinessConfigComponent } from '../business-config/business-config.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { NoPageComponent } from '../no-page/no-page.component';
import { UserInfoResolveService } from './user-info-resolve.service';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        component: MainComponent,
        resolve: {
          userInfo: UserInfoResolveService
        },
        children: [
          {
            path: 'userInfo',
            component: UserInfoComponent
          },
          {
            path: 'userList/:bid',
            component: UserListComponent
          },
          {
            path: 'role/:bid',
            component: RoleComponent
          },
          {
            path: 'menu/:bid',
            component: MenuComponent
          },
          {
            path: 'debugger',
            component: DebuggerComponent
          },
          {
            path: 'roleMenu/:bid',
            component: RoleMenuComponent
          },
          {
            path: 'reportPage/:bid/:rid',
            component: ReportPageComponent
          },
          {
            path: 'reportConfig/:bid/:rid',
            component: ReportConfigComponent
          },
          {
            path: 'noPage/:bid',
            component: NoPageComponent
          },
          {
            path: 'businessConfig',
            component: BusinessConfigComponent
          },
          {
            path: 'sysUserList',
            component: SysUserListComponent
          },
          {
            path: 'login',
            component: LoginComponent
          },
          {
            path: 'register',
            component: RegisterComponent
          },
          {
            path: 'resetPassword',
            component: ResetPasswordComponent
          },
          { path: '**', redirectTo: 'businessConfig', pathMatch: 'full' }
        ]
      }
    ])
  ],
  providers: [
    UserInfoResolveService
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule { }
