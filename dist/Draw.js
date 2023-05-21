"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VDom_1 = require("VDom");
class Draw {
    handle() { }
    constructor() {
        this._childDraw = [];
        this._destroy = false;
        this._framelate = 33;
        this._imageBuffer = null;
        this._position = {
            x: 0,
            y: 0,
        };
        this._size = {
            width: 0,
            height: 0,
        };
        this._background = "#000";
        this._dom = (0, VDom_1.default)("draw");
        this._draw = this._dom.get[0].getContext("2d");
    }
    set screenWidth(val) {
        this._dom.attr("width", val);
    }
    set screenHeight(val) {
        this._dom.attr("height", val);
    }
    get left() {
        return this._position.x;
    }
    set left(val) {
        this._position.x = val;
    }
    get top() {
        return this._position.y;
    }
    set top(val) {
        this._position.y = val;
    }
    get width() {
        return this._size.width;
    }
    set width(val) {
        this._size.width = val;
    }
    get height() {
        return this._size.height;
    }
    set height(val) {
        this._size.height = val;
    }
    get right() {
        return this.left + this.width;
    }
    set right(val) {
        this.left = val - this.width;
    }
    get bottom() {
        return this.top + this.height;
    }
    set bottom(val) {
        this.top = val - this.height;
    }
    get background() {
        return this._background;
    }
    set background(val) {
        this._background = val;
    }
    clear() {
        this._draw.clearRect(this.left, this.top, this.width, this.height);
        return this;
    }
    rect() {
        this._draw.fillStyle = this._background;
        this._draw.fillRect(this.left, this.top, this.width, this.height);
        return this;
    }
    circle() {
        this._draw.fillStyle = this._background;
        this._draw.ellipse(this.left + this.width / 2, this.top + this.height / 2, this.width, this.height, 0, 0, Math.PI * 2);
        this._draw.fill();
        return this;
    }
    image(imagePath, sourceX, sourceY) {
        if (!this._imageBuffer) {
            this._imageBuffer = new Image();
            this._imageBuffer.src = imagePath;
        }
        if (!sourceX) {
            sourceX = 0;
        }
        if (!sourceY) {
            sourceY = 0;
        }
        this._draw.drawImage(this._imageBuffer, sourceX, sourceY, this.width * 2, this.height * 2, this.left, this.top, this.width, this.height);
        return this;
    }
    addDraw(draw) {
        this._childDraw.push(draw);
        return this;
    }
    begin(callback) {
        const __begin__ = () => {
            this.clear();
            this.handle();
            if (callback) {
                callback();
            }
            for (let n = 0; n < this._childDraw.length; n++) {
                let d_ = this._childDraw[n];
                d_._draw.beginPath();
                d_.handle();
                if (d_._destroy) {
                    this._childDraw.splice(n, 1);
                }
            }
        };
        __begin__();
        this._interval = setInterval(__begin__, this._framelate);
    }
    stop() {
        clearInterval(this._interval);
    }
}
exports.default = Draw;
