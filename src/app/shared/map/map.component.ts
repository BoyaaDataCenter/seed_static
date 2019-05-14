import { Component, Inject, OnChanges, Output, OnInit, EventEmitter, ViewChild, Input, ElementRef } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { shortNameList } from './short';
const coordtransform = require('./coordtransform.js');
let CustomOverlay;
let BMap;
let BMapLib;
let isClickZoom = false;
let clickZoom;
let fpid = false;
let initFlag = false;

function initCustomOverlay () {

  BMap = window['BMap'];
  BMapLib = window['BMapLib'] || { Overlay: () => {} };

  /**
   * 自定义覆盖物
   */
  CustomOverlay = function (point, text, ratio, pid) {
    this.point = point;
    this.text = text;
    this.ratio = ratio;
    this.fpid = pid;
  };

  CustomOverlay.prototype = new BMap.Overlay();

  CustomOverlay.prototype.initialize = function (map) {
    this.map = map;

    const div = this.div = document.createElement('div');
    const styles = div.style;
    styles.position = 'absolute';
    styles.zIndex = BMap.Overlay.getZIndex(this.point.lat);
    styles.fontSize = '12px';

    if (this.text) {
      const size = 48 + 45 * this.ratio;

      const span = this.span = document.createElement('span');
      span.appendChild(document.createTextNode(this.text));
      const spanStyles = span.style;
      spanStyles.textAlign = 'center';
      spanStyles.borderRadius = '50%';
      spanStyles.display = 'flex';
      spanStyles.alignItems = 'center';
      spanStyles.backgroundColor = 'rgba(220, 76, 0, 1)';
      spanStyles.color = '#fff';
      spanStyles.padding = '1px';
      spanStyles.width = size + 'px';
      spanStyles.height = size + 'px';
      spanStyles.border = '2px solid #FF9800';
      spanStyles.overflow = 'hidden';
      spanStyles.justifyContent = 'center';

      span.innerHTML = this.text;
      div.appendChild(span);

      div.onmouseover = function(){
        spanStyles.width = 115 + 'px';
        spanStyles.height = 115 + 'px';
        this.style.zIndex = '2';
      };

      div.onmouseleave = function () {
        spanStyles.width = size + 'px';
        spanStyles.height = size + 'px';
        this.style.zIndex = '-9999999';
      };

      div.onclick = function () {
        const mapZoom = this.map.getZoom();
        const zoom = this.getNextZoom(mapZoom);

        isClickZoom = true;
        fpid = this.fpid;
        clickZoom = MapComponent.getDataZoomByMap(mapZoom);

        this.map.centerAndZoom(this.point, zoom);
      }.bind(this);

    } else {

      const icon = document.createElement('i');
      const iconStyles = icon.style;
      icon.className = 'fa fa-heart';
      iconStyles.color = '#DC4C00';
      iconStyles.fontSize = '12px';
      div.appendChild(icon);
    }

    map.getPanes().labelPane.appendChild(div);

    return div;
  };

  CustomOverlay.prototype.draw = function () {
    const map = this.map;
    const pixel = map.pointToOverlayPixel(this.point);

    const div = this.div;
    div.style.left = pixel.x + 'px';
    div.style.top = pixel.y + 'px';
  };

  CustomOverlay.prototype.getNextZoom = function (zoom) {
    // 国家
    if (zoom <= 4) {
      return 5;
    }
    // 省
    if (zoom >= 5 && zoom <= 6) {
      return 7;
    }
    // 市
    if (zoom >= 7 && zoom <= 9) {
      return 12;
    }
    // 区（县）
    if (zoom >= 10 && zoom <= 12) {
      return 16;
    }
    // 街道（乡镇）
    if (zoom >= 13 && zoom <= 15) {
      return 16;
    }
    // 社区
    if (zoom >= 16 && zoom <= 17) {
      return 18;
    }
    // 具体点
    // if (zoom > 17) {
    //   return 7;
    // }
  }
}
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnChanges {
  // 生成图表区域元素
  @ViewChild('mapWrap') mapWrap: ElementRef;
  // 图表区域高度
  @Input() height = '500px';
  // 图标区域宽度
  @Input() width = 'auto';
  // 指标列表
  @Input() indexsList = []; 
  @Input() indexsSelected = '';
  // 地图的经纬度范围参数
  @Input() mapQueryParam;
  // 地图的数据
  @Input() data;
  // 图表指标变化
  @Output() selectChange: EventEmitter<any> = new EventEmitter<any>();
  map;  
  scope;  
  curZoom;
  countNum;
  mapData;
  isClickZoom = false;
  zoomFpidCached = {};

  static getDataZoomByMap(zoom) {
    // 国家
    if (zoom <= 4) {
      return 1;
    }
    // 省
    if (zoom >= 5 && zoom <= 6) {
      return 2;
    }
    // 市
    if (zoom >= 7 && zoom <= 9) {
      return 3;
    }
    // 区（县）
    if (zoom >= 10 && zoom <= 12) {
      return 4;
    }
    // 街道（乡镇）
    if (zoom >= 13 && zoom <= 15) {
      return 4;
    }
    // 社区
    if (zoom >= 16 && zoom <= 17) {
      return 7;
    }
    // 具体点
    if (zoom > 17) {
      return 8;
    }

    return 1
  }
  constructor() {}
  ngOnChanges(changes) {  
    if (changes.data && changes.data.currentValue) {
      this.initData();
      if (!this.map) {
        this.initMap();
      } else {
        this.drawMap();
      }
    }
  }
  initData() {
    this.mapData = this.data.data;
  }
  initMap() {
    initCustomOverlay();
    this.map = new BMap.Map(this.mapWrap.nativeElement);
    // 默认显示中国的经纬度
    this.map.centerAndZoom(new BMap.Point(100.015727, 35.201884), 5);
    
    this.map.enableScrollWheelZoom();

    this.map.addControl(new BMap.NavigationControl());

    this.refreshScopeData();
    this.map.clearOverlays();
    let data = this.getData();
    this.addMarker(data);

    this.lister().debounceTime(300).subscribe((isZoom) => {
      this.setQueryParams()
    });
  }
  drawMap() {    
    this.refreshScopeData();
    this.map.clearOverlays();
    let data = this.getData();
    this.addMarker(data);
  }
  getData() {
    let data = this.mapData;
    this.curZoom = this.getDataZoomByMapZoom();
    let countField = this.indexsSelected;
    if (data && data.length) {
      let max = 0;

      // 非 8 等级加总求比例
      if (this.curZoom !== 8) {
         data.reduce((rs, item) => {
          rs += item[countField] || 0;

          if (item[countField] > max) {
            max = item[countField];
          }
          return rs;
        }, 0);
      }

      data.map((item) => {
        // 7,8 转国际坐标为百度坐标
        if (this.curZoom === 8 || this.curZoom === 7) {
          const bd09 = this.coordToBd09(item);
          item['lng'] = bd09.lng;
          item['lat'] = bd09.lat;
        }

        if (this.curZoom !== 8) {
          item['ratio'] = item[countField] / max;
        }
      });

      this.calculateCountNum();
      return data;
    } else {
      return [];
    }
  }
  addMarker(data) {
    const zoom = this.curZoom = this.getDataZoomByMapZoom();

    let countField = this.indexsSelected;

    data.forEach((item) => {
      const pt = new BMap.Point(item.lng, item.lat);

      let text;

      // 小于等级 8 显示标签
      if ( zoom <= 7) {
        text = `${this.getName(item.region_name)}<br/> ${item[countField]}`;
      }

      const marker = new CustomOverlay(pt, text, item.ratio, item.fpid);
      this.map.addOverlay(marker);
    });
  }
  getName(name) {
    return shortNameList[name] || name || '';
  }
  lister() {
    return Observable.create((sub) => {
      this.map.addEventListener('zoomend', () => {
        if (this.refreshScopeData(true)) {
          this.map.clearOverlays();
          sub.next(true);
        } else {
          this.calculateCountNum();
        }
      });
      this.map.addEventListener('dragend', () => {
        if (this.refreshScopeData()) {
          sub.next(false);
        } else {
          this.calculateCountNum();
        }
      });
    });
  }
  setQueryParams() {
    const scope = this.scope;
    let sCoord = { lng: scope.slng, lat: scope.slat };
    let eCoord = { lng: scope.elng, lat: scope.elat };

    // 7,8 取数转百度坐标为国际坐标
    if (this.curZoom === 7 || this.curZoom === 8) {
      sCoord = this.coordToWGS84(sCoord);
      eCoord = this.coordToWGS84(eCoord);
    }

    const mapZoom = this.map.getZoom();
    const preZoom = this.curZoom;
    const curZoom = this.curZoom = this.getDataZoomByMapZoom();

    // 点击带 fpid
    if (isClickZoom) {
      this.mapQueryParam.fpid = fpid;
      this.zoomFpidCached[curZoom] = fpid;
    // 滑动
    } else {
      // 滑动往下
      if (curZoom > preZoom) {
        // 如果之前点击过，则携带当前所有元素的 fpid 去请求数据
        if (fpid) {
          const fpids = this.mapData.reduce((rs, item) => { rs.push(item.fpid); return rs; }, []).join('|');
          this.mapQueryParam.fpid = fpids;
          this.zoomFpidCached[curZoom] = fpids;
        }

      // 滑动往上
      } else {
        if (clickZoom) {
          // 如果之前点击过，则在当前 zoom 小于点击 zoom 时，清掉相关数据
          if (curZoom < clickZoom) {
            fpid = false;
            clickZoom = null;
            this.zoomFpidCached = {};
            this.mapQueryParam.fpid = false;
          // 在当前 zoom 大于点击 zoom 时，取缓存的 fpid
          } else {
            this.mapQueryParam.fpid = this.zoomFpidCached[curZoom] ? this.zoomFpidCached[curZoom] : false;
          }
        }
      }
    }

    isClickZoom = false;
    this.mapQueryParam.slat = sCoord.lat;
    this.mapQueryParam.elat = eCoord.lat;
    this.mapQueryParam.slng = sCoord.lng;
    this.mapQueryParam.elng = eCoord.lng;
    this.mapQueryParam.region_id = curZoom;
    this.mapQueryParam.fpid = this.mapQueryParam.fpid ? this.mapQueryParam.fpid : false;
    this.selectChange.emit({'type': 'indexs', 'value': this.indexsSelected});
  }
  getDataZoomByMapZoom() {
    const zoom = this.map.getZoom();

    return MapComponent.getDataZoomByMap(zoom);
  }
  coordToWGS84(coord: { lng: number, lat: number }) {
    const gcj = coordtransform.bd09togcj02(coord.lng, coord.lat);
    const wgs84 = coordtransform.gcj02towgs84(gcj[0], gcj[1]);

    return { lng: wgs84[0], lat: wgs84[1] };
  }
  coordToBd09(coord: { lng: number, lat: number }) {
    const gcj = coordtransform.wgs84togcj02(coord.lng, coord.lat);
    const bd09 = coordtransform.gcj02tobd09(gcj[0], gcj[1]);

    return { lng: bd09[0], lat: bd09[1] };
  }
  calculateCountNum() {
    if (this.curZoom === 8) {
      const bs = this.map.getBounds();
      const bssw = bs.getSouthWest();
      const bsne = bs.getNorthEast();

      this.countNum = this.mapData.reduce((rs, item) => {
        if (item['lng'] >= bssw.lng && item['lng'] <= bsne.lng &&
        item['lat'] >= bssw.lat && item['lat'] <= bsne.lat) {
          rs += 1;
        }
        return rs;
      }, 0);
    }
  }
  refreshScopeData(isZoom?) {
    const scope = this.scope;
    const bs = this.map.getBounds();
    const bssw = JSON.parse(JSON.stringify(bs.getSouthWest()));
    const bsne = JSON.parse(JSON.stringify(bs.getNorthEast()));

    const curZoom = this.curZoom;
    let refresh = false;

    if ((curZoom === 1 || curZoom === 2 || curZoom === 3)) {
      if (curZoom === this.getDataZoomByMapZoom()) {
        return false;
      } else {
        refresh = true;
      }
    } else {
      if (isZoom) {
        refresh = true;
      }
    }

    if (!this.scope || refresh || bssw.lng < scope.slng || bssw.lat < scope.slat ||
      bsne.lng > scope.elng || bsne.lat > scope.elat) {

      let zoom = curZoom || 1;

      if (this.getDataZoomByMapZoom() === 8) {
        zoom = 1;
      }

      const XDistance = (bsne.lng - bssw.lng) * zoom;
      const YDistance = (bsne.lat - bssw.lat) * zoom;

      bssw.lng -= XDistance;
      bsne.lng += XDistance;

      bssw.lat -= YDistance;
      bsne.lat += YDistance;

      this.scope = { slng: bssw.lng, slat: bssw.lat, elng: bsne.lng, elat: bsne.lat };

      return true;
    } else {
      return false;
    }
  }
  selectIndexsValue(target) {
    this.indexsSelected = target.value;
    this.selectChange.emit({'type': 'indexs', 'value': this.indexsSelected});
  }
}
