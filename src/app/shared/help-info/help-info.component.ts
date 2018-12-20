import {Component, Input, HostListener} from '@angular/core';
// import {GlobalDataService} from '../../core/global-data.service';

/**
 * 帮助信息
 */
@Component({
  selector: 'app-help-info',
  templateUrl: './help-info.component.html',
  styleUrls: ['./help-info.component.scss']
})
export class HelpInfoComponent {
  // 可选，帮助信息的 key
  @Input() dim;
  // 可选，帮助信息显示的内容
  @Input() dimHelp;

  @Input() icon = 'fa fa-question-circle app-help__icon';

  helpInfoList = [];
  helpShow = false;
  selfClick = false;

  constructor(
    // private globalDataService: GlobalDataService
   ) { }

  showHelpInfo() {
    this.selfClick = true;
    if (this.helpShow) {
      this.helpShow = false;
    } else {
      this.helpShow = true;
      if (this.dimHelp) {
        this.helpInfoList = [{label: '', value: this.dimHelp}];
      } else {
        if (this.dim) {
          if (Array.isArray(this.dim)) {
            this.helpInfoList = this.dim;
          }
        }
      }

    }
  }

  detailClick() {
    this.selfClick = true;
  }

  noneClick() {
    this.selfClick = true;
  }

  /**
   * 点击页面其它地方隐藏系统菜单
   * @param ev
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(ev): void {
    if (this.helpShow && !this.selfClick) {
      this.helpShow = false;
    }
    this.selfClick = false;
  }
}
