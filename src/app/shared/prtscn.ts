const rasterizeHTML = require('../../../node_modules/rasterizehtml');

export class Prtscn {
  doc;
  docEl;
  bodyEl;

  scrollWidth;
  scrollHeight;

  offsetWidth;
  offsetHeight;

  canvasWrapEl;
  canvasEl;
  canvasContext;

  imgCanvasLength;
  imgCanvasLoadCount;

  exportName;
  onError;
  onComplete;

  constructor(options?: {
    exportName?: string,
    onError?: () => void,
    onComplete?: (error?) => void
  }) {
    this.exportName = options.exportName || '未命名';
    this.onError = options.onError || null;
    this.onComplete = options.onComplete || null;

    this.doc = document;
    this.docEl = this.doc.documentElement;
    this.bodyEl = this.doc.body;
    this.scrollWidth = this.docEl.scrollWidth + 17;
    if (this.docEl.classList.contains('mini')) {
      this.offsetWidth = 51;
    } else {
      this.offsetWidth = this.scrollWidth * 0.16 <= 140 ? 141 : this.scrollWidth * 0.16;
    }
    this.offsetHeight = 90;
    this.scrollHeight = this.docEl.scrollHeight;
    this.gCanvasEl();
    this.rasterize();
  }

  gCanvasEl() {
    const canvasWrapEl = this.doc.createElement('div');
    canvasWrapEl.style.width = '0px';
    canvasWrapEl.style.height = '0px';
    canvasWrapEl.style.overflow = 'hidden';
    const canvasEl = this.doc.createElement('canvas');
    canvasEl.width = this.scrollWidth - this.offsetWidth;
    canvasEl.height = this.scrollHeight - this.offsetHeight;
    canvasWrapEl.appendChild(canvasEl);
    this.bodyEl.appendChild(canvasWrapEl);
    this.canvasWrapEl = canvasWrapEl;
    this.canvasEl = canvasEl;
    this.canvasContext = canvasEl.getContext('2d');
  }

  rasterize() {
    rasterizeHTML.drawDocument(this.doc.cloneNode(true),
      { width: this.scrollWidth, height: this.scrollHeight}).
      then((renderResult) => {
        this.canvasContext.drawImage(renderResult.image, -this.offsetWidth, -this.offsetHeight);
        this.gCanvasImg();
      }, (e) => {
        if (typeof this.onError !== 'undefined') {
          this.onError(e);
        }
      });
  }

  gCanvasImg() {
    const canvasList = this.doc.getElementsByTagName('canvas');
    this.imgCanvasLength = canvasList.length - 1;
    this.imgCanvasLoadCount = 0;
    for (let i = 0; i < this.imgCanvasLength; i++) {
      const img = new Image();
      const position = this.getCoords(canvasList[i]);
      img.src = canvasList[i].toDataURL();
      img.onload = () => {
        this.canvasContext.drawImage(img, position.left - this.offsetWidth, position.top - this.offsetHeight);
        this.setLoadCount();
      };
    }
  }

  setLoadCount() {
    this.imgCanvasLoadCount += 1;
    if (this.imgCanvasLoadCount === this.imgCanvasLength) {
      this.exportImg();
      this.destroy();
    }
  }

  exportImg() {
    const link = this.doc.createElement('a');
    link.style.display = 'none';
    this.bodyEl.appendChild(link);
    if (link.download !== undefined) {
      link.setAttribute('href', this.canvasEl.toDataURL('image/png').
      replace(/^data:image\/png/, 'data:application/octet-stream'));
      link.setAttribute('download', this.exportName + '_' + Date.now() + '.png');
      document.body.appendChild(link);
      link.click();
    }
    this.bodyEl.removeChild(link);
  }

  destroy() {
    this.bodyEl.removeChild(this.canvasWrapEl);
    if (typeof this.onComplete !== 'undefined') {
      this.onComplete();
    }
  }

  getCoords(elem) {
    const box = elem.getBoundingClientRect();
    const scrollTop = window.pageYOffset || this.docEl.scrollTop || this.bodyEl.scrollTop;
    const scrollLeft = window.pageXOffset || this.docEl.scrollLeft || this.bodyEl.scrollLeft;
    const clientTop = this.docEl.clientTop || this.bodyEl.clientTop || 0;
    const clientLeft = this.docEl.clientLeft || this.bodyEl.clientLeft || 0;
    const top  = box.top +  scrollTop - clientTop;
    const left = box.left + scrollLeft - clientLeft;
    return { top: Math.round(top), left: Math.round(left) };
  }

}
