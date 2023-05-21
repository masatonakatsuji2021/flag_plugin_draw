"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VDom_1 = require("VDom");
const KeyEvent_1 = require("KeyEvent");
class Draw {
    handle() { }
    constructor() {
        this._childDraw = [];
        this._destroy = false;
        this._framelate = 33;
        this._framestopped = false;
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
    get framelate() {
        return this._framelate;
    }
    set framelate(val) {
        this._framelate = val;
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
    line() {
        this._draw.strokeStyle = this._background;
        this._draw.lineWidth = 1;
        this._draw.beginPath();
        this._draw.moveTo(this.left, this.top);
        this._draw.lineTo(this.width, this.height);
        this._draw.stroke();
        return this;
    }
    zoomIn(step) {
        if (!step) {
            step = 1;
        }
        this.left -= step;
        this.top -= step;
        this.width += step * 2;
        this.height += step * 2;
        return this;
    }
    zoomOut(step) {
        if (!step) {
            step = 1;
        }
        if (this.width < 0 || this.height < 0) {
            return this;
        }
        this.left += step;
        this.top += step;
        this.width -= step * 2;
        this.height -= step * 2;
        return this;
    }
    onkeyArrowLeft(downCallback, upCallback) {
        KeyEvent_1.default.onArrowLeft(downCallback, upCallback);
        return this;
    }
    onkeyArrowRight(downCallback, upCallback) {
        KeyEvent_1.default.onArrowRight(downCallback, upCallback);
        return this;
    }
    onkeyArrowUp(downCallback, upCallback) {
        KeyEvent_1.default.onArrowUp(downCallback, upCallback);
        return this;
    }
    onKeyArrowDown(downCallback, upCallback) {
        KeyEvent_1.default.onArrowDown(downCallback, upCallback);
        return this;
    }
    onKeyEnter(downCallback, upCallback) {
        KeyEvent_1.default.onEnter(downCallback, upCallback);
        return this;
    }
    onKeySpace(downCallback, upCallback) {
        KeyEvent_1.default.onSpace(downCallback, upCallback);
        return this;
    }
    onKeyNumber(keyNumber, downCallback, upCallback) {
        KeyEvent_1.default.onNumber(keyNumber, downCallback, upCallback);
        return this;
    }
    onKey(fullKeyName, downCallback, upCallback) {
        KeyEvent_1.default.on(fullKeyName, downCallback, upCallback);
        return this;
    }
    addDraw(draw) {
        this._childDraw.push(draw);
        return this;
    }
    begin(callback) {
        const __begin__ = () => {
            if (this._framestopped) {
                return;
            }
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
    pause() {
        this._framestopped = true;
        return this;
    }
    resume() {
        this._framestopped = false;
        return this;
    }
    stop() {
        clearInterval(this._interval);
    }
}
exports.default = Draw;
