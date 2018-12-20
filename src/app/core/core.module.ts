import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import {GlobalDataService} from './global-data.service';
import {QueryDataService} from './query-data.service';
import {KeyDataService} from './services/key-data.service';
import {ConfigService} from './services/config.service';
import {FetchService} from './services/fetch.service';
import {ChartTableService} from './services/chart-table.service';
import {TabDataService} from './services/tab-data.service';
import {ChartService} from './chart.service';
// import {DropdownService} from './services/dropdown.service';

import {ConfirmationService} from '../primeng/primeng';
// 业务管理
import {SetService} from './services/set.service';
// 用户管理
import {UserListService} from './services/user-list.service';
// 用户详情
import {UserInfoService} from './services/user-info.service';
// 角色管理
import {RoleService} from './services/role.service';
// 菜单管理
import {MenuService} from './services/menu.service';
// 用户模拟
import {DebuggerService} from './debugger.service';
// 用户菜单
import {RoleMenuService} from './services/role-menu.service';
// 报表页面
import {ReportPageService} from './services/report-page.service';
// 报表配置
import {ReportConfigService} from './services/report-config.service';
// 业务管理页面
import {BusinessConfigService} from './services/business-config.service';
// 报表
import {ReportElementService} from './services/report-element.service';
// 登录相关
import {LoginService} from './services/login.service';
// 重置密码相关
import {ResetPasswordService} from './services/reset-password.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  declarations: [

  ],
  providers: [
    GlobalDataService,
    QueryDataService,
    KeyDataService,
    ConfigService,
    FetchService,
    ChartTableService,
    TabDataService,
    ChartService,
    ConfirmationService,
    SetService,
    UserListService,
    UserInfoService,
    RoleService,
    MenuService,
    DebuggerService,
    RoleMenuService,
    ReportPageService,
    ReportConfigService,
    BusinessConfigService,
    ReportElementService,
    LoginService,
    ResetPasswordService
  ],
  exports: [
    SharedModule
  ]
})
export class CoreModule { }
