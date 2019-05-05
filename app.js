class StarBoard{
    constructor(){
        this._3x5Array = new Array(3).fill(new Array(5).fill(0));
        this._2x5Array = new Array(2).fill(new Array(5).fill(0));
        this.sprites = this._3x5Array.map((arr)=>arr.slice());
        this.colors = this._3x5Array.map((arr)=>arr.slice());
        this.BoardCenterX = 0;
        this.BoardCenterY = 0;
        this.InnerCircleRad = [
            1.5707963267948966,
            0.3141592653589793,
            5.340707511102648,
            4.084070449666731,
            2.827433388230814
        ];
        this.OuterPositionCircleRad = [
            [2.6179938779914944,0.5235987755982988],
            [1.3613568165555772,5.550147021341967],
            [0.10471975511965977,4.293509959906051],
            [5.1312680008633285,3.036872898470133],
            [3.8746309394274117,1.780235837034216]
        ];
        this.InnerCircleCenterPositionX = 0;
        this.InnerCircleCenterPositionY = 0;
        this.OrbPositions = this._3x5Array.map((arr)=>arr.slice());
        this.w_Width = window.innerWidth;
        this.w_Height = window.innerHeight;

        this.app = new PIXI.Application({
            width:this.w_Width,
            height:this.w_Height,
            backgroundColor:0xffffe0
        });

        this.app.view.style.position = "absolute";
        this.app.renderer.view.style.display = "block";
        this.app.renderer.autoDensity = true;
        this.app.resize(this.w_Width,this.w_Height);

        document.body.appendChild(this.app.view);

        this.sheet = null;
        
        
    }
    
    Initilize() {
        PIXI.Loader.shared.add("images/orbs.json").load(this.Initilize);
        this.sheet = PIXI.Loader.shared.resources["images/orbs.json"].spritesheet;
        this._red = new PIXI.Sprite(sheet.textures["red.png"]);
        this._red.position.set(100,100);
        this.sprites.reduce.anchor.set(0.5,0.5);
        this.app.stage.addChild(this._red);
    }
}

let sb = new StarBoard();