import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import {GlobalDataService} from '../core/global-data.service';
import {ConfigService} from '../core/services/config.service';
import {BusinessConfigService} from '../core/services/business-config.service';

/**
 * 应用的最外层
 */
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [GlobalDataService]
})
export class MainComponent implements OnInit, OnDestroy {
  // 导航菜单
  items: any[] = [];
  // 用户信息
  userName;
  userInfo = {'name': '', 'role': ''};

  menuList = [];
  menuListVisible = false;
  // 检测是否需要更新菜单
  menuSubscribe$;

  businessSelected = {
    'id': '',
    'name': ''
  };

  businessListVisible = false;

  businessList = [];

  // 特殊的路径
  specialRouterList = ['/login', '/register', '/resetPassword'];

  constructor(
    private route: ActivatedRoute,
    private configService: ConfigService,
    private router: Router,
    private businessConfigService: BusinessConfigService,
    private globalDataService: GlobalDataService) {
      this.menuSubscribe$ = globalDataService.menuChange$.subscribe(() => {
        this.items = [];
        this.initMenu();
      });
    }

  ngOnInit() {

    // 根据是否已登录进行处理
    if (this.specialRouterList.indexOf(this.configService.getPathName()) > -1) {
      this.router.navigate([this.configService.getPathName()]);
      this.configService.clearBusinessInfo();
      return false;
    }

    // 监听路由变化
    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        const currentRouterUrl = this.router.url.split('/')[1];
        this.menuListVisible = currentRouterUrl == 'businessConfig' ? false : true;
        this.setCurMenu();
        this.configService.clearBusinessInfo();
      });

    // 获取用户信息并存储
    this.route.data.forEach((data) => {
      if (data && data['userInfo']) {
        const userInfo = data['userInfo'];
        this.userInfo = userInfo.userInfo;
        this.globalDataService.setParams({ userInfo: this.userInfo });
        if (this.userInfo.name) {
          this.userName = this.userInfo.name;
        } else {
          this.userName = '佚名';
        }
        this.businessSelected.id = this.configService.getBusinessId();
        this.businessSelected.name = this.configService.getBusinessName();
        this.initMenu();
        this.businessConfigService.getBusinessList().subscribe( (listData) => {
          this.businessList = listData.my_bussiness;
        });
        const pathName = this.configService.getPathName();
        this.configService.clearBusinessInfo();
        this.router.navigate([pathName]);
      }
    });
  }

  // 返回业务列表
  jumpToBusinessList() {
    this.configService.clearBusinessInfo();
    this.router.navigateByUrl(`/businessConfig`);
  }

  dealHideMenu() {
    // 是否隐藏菜单列表
    this.menuListVisible = ['businessConfig', 'debugger', 'reportConfig', 'sysUserList', 'login', 'register', 'resetPassword', 'userInfo']
      .indexOf(this.router.url.split('/')[1]) > -1 ? false : true;
  }

  initMenu() {
    this.configService.getUserMenu().subscribe((menuList) => {
      this.menuList = menuList;
      this.dealMenu();
    });
  }

  dealMenu() {
    this.items = [];
    // 设置业务菜单列表
    this.menuList.forEach((v, index) => {
      let items = [];
      if (v.sub_menus && v.sub_menus.length > 0) {
        v.sub_menus.forEach((sub) => {
          if (sub.sub_menus && v.sub_menus.length > 0) {
            let items_ = [];
            sub.sub_menus.forEach((sub_) => {
              items_.push({ label: sub_.name, routerLink: ['/reportPage', this.businessSelected.id, sub_.id],
                command: this.changeActiveNav.bind(this) });
            });
            items.push({ label: sub.name,  items: items_});
          }else {
            items.push({ label: sub.name,  routerLink: ['/reportPage', this.businessSelected.id, sub.id],
              command: this.changeActiveNav.bind(this) });
          }
        });
        this.items.push({ label: v.name, icon: 'fa-list-ul', items: items});
      }else {
        this.items.push({ label: v.name, icon: 'fa-list-ul', routerLink: ['/reportPage', this.businessSelected.id, v.id],
          command: this.changeActiveNav.bind(this) });
      }
    });
    // 管理员和超级管理员可见
    if (this.userInfo.role != 'user') {
      this.items.push({
        label: '管理中心',
        icon: 'fa-slideshare',
        items: [
          {
            label: '用户管理',
            routerLink: ['/userList/' + this.businessSelected.id],
            command: this.changeActiveNav.bind(this)
          }, {
            label: '角色管理',
            routerLink: ['/role/' + this.businessSelected.id],
            command: this.changeActiveNav.bind(this)
          }, {
            label: '菜单管理',
            routerLink: ['/menu/' + this.businessSelected.id],
            command: this.changeActiveNav.bind(this)
          }, {
            label: '角色菜单管理',
            routerLink: ['/roleMenu/' + this.businessSelected.id],
            command: this.changeActiveNav.bind(this)
          }
        ]
      });
    }
    this.setCurMenu();
  }

  // 初始化选中菜单样式
  setCurMenu() {
    this.dealHideMenu();
    let curUrl = this.router.url;
    let existDefaultPage = false;
    this.items.map((item) => {
      item['active'] = false;
      item['expanded'] = false;
      if (item.items && item.items.length) {
        item.items.map((v) => {
          v['active'] = false;
          v['expanded'] = false;
          if (v.items && v.items.length) {
            v.items.map((v_) => {
              v_['active'] = false;
              v_['expanded'] = false;
              if (v_.routerLink && v_.routerLink.join('/') === curUrl) {
                v_['active'] = true;
                v_['expanded'] = true;
                v['active'] = true;
                v['expanded'] = true;
                item['active'] = true;
                item['expanded'] = true;
                existDefaultPage = true;
              }
              return v_;
            });
          } else {
            if (v.routerLink) {
              if (v.routerLink.join('/') === curUrl) {
                v['active'] = true;
                v['expanded'] = true;
                item['active'] = true;
                item['expanded'] = true;
                existDefaultPage = true;
              }
            }
          }
          return v;
        });
      } else {
        if (item.routerLink) {
          if (item.routerLink.join('/') === curUrl) {
            item['active'] = true;
            item['expanded'] = true;
          }
        }
      }
      return item;
    });
  }

  // 根据点击左侧菜单栏改变选中状态
  changeActiveNav(e) {
    if (e.item.active) {
      return ;
    }
    this.items.map((item) => {
      item['active'] = false;
      item['expanded'] = false;
      if (item.items && item.items.length) {
        item.items.map((v) => {
          v['active'] = false;
          v['expanded'] = false;
          if (v.routerLink && e.item.routerLink[0] === v.routerLink[0] && e.item.routerLink[1] === v.routerLink[1]) {
            v['active'] = true;
            item['active'] = true;
            item['expanded'] = true;
            return v;
          }else {
            if (v.items && v.items.length) {
              v.items.map((v_) => {
                v_['active'] = false;
                if (v_.routerLink && e.item.routerLink[0] === v_.routerLink[0] && e.item.routerLink[1] === v_.routerLink[1]) {
                  v_['active'] = true;
                  v['active'] = true;
                  v['expanded'] = true;
                  item['active'] = true;
                  item['expanded'] = true;
                  return v_;
                }
              });
            }
          }
        });
      }
    });
  }

  // 改变业务
  changeBusiness(item) {
    if (item.id == this.businessSelected['id']) {
      return;
    }
    this.businessConfigService.setBusinessId(item.id);
    this.businessConfigService.setBusinessName(item.name);
    this.businessListVisible = false;
    this.configService.selectBusiness({'bussiness_id': parseInt(item.id, 10)}).subscribe(() => {
      this.configService.getUserMenu().subscribe((menuList) => {
        this.businessSelected.id = item.id;
        this.businessSelected.name = item.name;
        this.menuList = menuList;
        this.dealMenu();
        if (this.menuList.length == 0) {
          this.router.navigateByUrl('/noPage/' + item.id);
        }else {
          this.router.navigateByUrl('/reportPage/' + item.id + '/' + this.checkMenu(menuList[0]));
        }
      });
    });
  }

  checkMenu(menu) {
    if (menu) {
      if ( menu.sub_menus && menu.sub_menus.length > 0) {
        return this.checkMenu(menu.sub_menus[0]);
      }else {
        return menu.id;
      }
    }
  }

  ngOnDestroy() {
    this.menuSubscribe$.unsubscribe();
  }
}

