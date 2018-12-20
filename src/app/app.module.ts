import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule,  } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { RoutingModule } from './routing/routing.module';
import { CoreModule } from './core/core.module';
import { MainComponent } from './main/main.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserListComponent } from './user-list/user-list.component';
import { RoleComponent } from './role/role.component';
import { MenuComponent } from './menu/menu.component';
import { DebuggerComponent } from './debugger/debugger.component';
import { RoleMenuComponent } from './role-menu/role-menu.component';
import { ReportPageComponent } from './report-page/report-page.component';
import { BusinessConfigComponent } from './business-config/business-config.component';
import { SysUserListComponent } from './sys-user-list/sys-user-list.component';
import { ReportConfigComponent } from './report-config/report-config.component';
import { ReportElementComponent } from './report-element/report-element.component';
import { ReportQueryComponent } from './report-query/report-query.component';
import { SysHeaderComponent } from './sys-header/sys-header.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { GlobalHeaderComponent } from './global-header/global-header.component';
import { NoPageComponent } from './no-page/no-page.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    UserInfoComponent,
    UserListComponent,
    RoleComponent,
    MenuComponent,
    DebuggerComponent,
    RoleMenuComponent,
    ReportPageComponent,
    BusinessConfigComponent,
    SysUserListComponent,
    ReportConfigComponent,
    ReportElementComponent,
    ReportQueryComponent,
    SysHeaderComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    GlobalHeaderComponent,
    NoPageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RoutingModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
