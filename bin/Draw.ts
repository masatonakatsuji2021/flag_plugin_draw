import v from "VDom";
import KeyEvent from "KeyEvent";

export default class Draw{

    private _dom;
    private _draw;
    private _interval;
    private _childDraw = [];
    private _destroy = false;
    private _framelate = 33;
    private _framestopped = false;
    private _imageBuffer = null;

    private _position = {
        x: 0,
        y: 0,
    };

    private _size = {
        width: 0,
        height: 0,
    };

    private _background = "#000";

    handle(){}

    constructor(){
        this._dom = v("draw");
        this._draw = this._dom.get[0].getContext("2d");
    }

    set screenWidth(val){
        this._dom.attr("width", val);
    }

    set screenHeight(val){
        this._dom.attr("height", val);
    }

    get left(){
        return this._position.x;
    }

    set left(val : number){
        this._position.x = val;
    }

    get top(){
        return this._position.y;
    }

    set top(val : number){
        this._position.y = val;
    }

    get width(){
        return this._size.width;
    }

    set width(val : number){
        this._size.width = val;
    }

    get height(){
        return this._size.height;
    }

    set height(val : number){
        this._size.height = val;
    }

    get right(){
        return this.left + this.width;
    }

    set right(val : number){
        this.left = val - this.width;
    }

    get bottom(){
        return this.top + this.height;
    }

    set bottom(val : number){
        this.top = val - this.height;
    }

    get background(){
        return this._background;
    }

    set background(val){
        this._background = val;
    }

    get framelate(){
        return this._framelate;
    }

    set framelate(val){
        this._framelate = val;
    }

    clear(){
        this._draw.clearRect(
            this.left,
            this.top,
            this.width,
            this.height
        )
        return this;
    }

    rect(){
        this._draw.fillStyle = this._background;
        this._draw.fillRect(
            this.left,
            this.top,
            this.width,
            this.height
        );
        return this;
    }

    circle(){
        this._draw.fillStyle = this._background;
        this._draw.ellipse(
            this.left + this.width / 2,
            this.top + this.height / 2,
            this.width,
            this.height,
            0,
            0,
            Math.PI * 2
        );
        this._draw.fill();
        return this;
    }

    image(imagePath : string, sourceX? : number, sourceY? : number){

        if(!this._imageBuffer){
            this._imageBuffer = new Image();
            this._imageBuffer.src = imagePath;    
        }

        if(!sourceX){
            sourceX = 0;
        }

        if(!sourceY){
            sourceY = 0;
        }

        this._draw.drawImage(
            this._imageBuffer,
            sourceX,
            sourceY,
            this.width * 2,
            this.height * 2,
            this.left,
            this.top,
            this.width,
            this.height,
        );
        return this;
    }

    line(){
        this._draw.strokeStyle = this._background;
        this._draw.lineWidth  = 1;
        this._draw.beginPath();
        this._draw.moveTo(this.left, this.top);
        this._draw.lineTo(this.width, this.height);
        this._draw.stroke();
        return this;
    }

    zoomIn(step? : number){
        if(!step){
            step = 1;
        }

        this.left -= step;
        this.top -= step;
        this.width += step * 2;
        this.height += step * 2;

        return this;
    }

    zoomOut(step? : number){
        if(!step){
            step = 1;
        }

        if(this.width < 0 || this.height < 0){
            return this;
        }

        this.left += step;
        this.top += step;
        this.width -= step * 2;
        this.height -= step * 2;

        return this;
    }

    onkeyArrowLeft(downCallback : Function, upCallback? : Function){
        KeyEvent.onArrowLeft(downCallback,upCallback);
        return this;
    }

    onkeyArrowRight(downCallback : Function, upCallback? : Function){
        KeyEvent.onArrowRight(downCallback,upCallback);
        return this;
    }

    onkeyArrowUp(downCallback : Function, upCallback? : Function){
        KeyEvent.onArrowUp(downCallback,upCallback);
        return this;
    }

    onKeyArrowDown(downCallback : Function, upCallback? : Function){
        KeyEvent.onArrowDown(downCallback,upCallback);
        return this;
    }

    onKeyEnter(downCallback : Function, upCallback? : Function){
        KeyEvent.onEnter(downCallback,upCallback);
        return this;
    }

    onKeySpace(downCallback : Function, upCallback? : Function){
        KeyEvent.onSpace(downCallback,upCallback);
        return this;
    }

    onKeyNumber(keyNumber : number, downCallback : Function, upCallback? : Function){
        KeyEvent.onNumber(keyNumber, downCallback,upCallback);
        return this;
    }

    onKey(fullKeyName : string, downCallback : Function, upCallback? : Function){
        KeyEvent.on(fullKeyName,downCallback,upCallback);
        return this;
    }

    addDraw(draw : Draw){
        this._childDraw.push(draw);
        return this;
    }

    begin(callback? : Function){

        const __begin__ = ()=>{
            
            if(this._framestopped){
                return;
            }

            this.clear();
            this.handle();

            if(callback){
                callback();
            }

            for(let n : number = 0 ; n < this._childDraw.length ; n++){
                let d_ : Draw = this._childDraw[n];

                d_._draw.beginPath();
                d_.handle();

                if(d_._destroy){
                    this._childDraw.splice(n, 1);
                }
            }
        };

        __begin__();
        this._interval = setInterval(__begin__, this._framelate);
    }

    pause(){
        this._framestopped = true;
        return this;
    }

    resume(){
        this._framestopped = false;
        return this;
    }

    stop(){
        clearInterval(this._interval);
    }
}