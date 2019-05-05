class StarBoard{
    constructor(){
        /**
         *  データ構造について
         *   配列が3*5の時
         * 
         *   例
         *   let a = [
         *    [0,0,0,0,0],
         *    [0,0,0,0,0],
         *    [0,0,0,0,0]
         *    ]
         * 
         *   a[i][j]のiは星の深さ、jは星の位置
         */

        //スプライト格納 3*5
        this.sprites = [];
        //色情報の格納 3*5
        this.colors = [];

        //星の中心座標
        this.BoardCenter = {};
        //オーブ配置の中心座標
        this.InnerCircleCenterPosition = {};

        //オーブの全配置 (配列内は{"x":0,"y":0}で初期化)
        this.OrbPositions = [];

        //オーブ配置のラジアン（定数・参照のみ）
        this.InnerCircleRad = [];
        //オーブ配置のラジアン (定数・参照のみ)
        this.OuterPositionCircleRad = [];
    }

    Initialise() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this._3x5Array = new Array(3).fill(new Array(5).fill(0));
        this._2x5Array = new Array(2).fill(new Array(5).fill(0));

        this.sprites = this._3x5Array.map((arr)=>arr.slice());
        this.colors = this._3x5Array.map((arr)=>arr.slice());

        this.BoardCenter = {
            "x":0,
            "y":0
        }

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

        this.InnerCircleCenterPosition = {
            "x":0,
            "y":0
        }

        this.OrbPositions = this._3x5Array.map((arr)=>arr.slice());
        
        this.app = new PIXI.Application({
            width:this.width,
            height:this.height,
            backgroundColor:0xffffe0
        });

        this.app.view.style.position = "absolute";
        this.app.renderer.view.style.display = "block";
        this.app.renderer.autoDensity = true;
        this.app.resize(this.w_Width,this.w_Height);

        this.sheet = null;
        this._red = null;

        document.body.appendChild(this.app.view);

        PIXI.Loader.shared.add("images/orbs.json").load((loder, resources) => {
            this.sheet = resources["images/orbs.json"].spritesheet;
            this._red = new PIXI.Sprite(this.sheet.textures["red.png"]);
            this._red.position.set(100,100);
            this._red.anchor.set(0.5,0.5);
            this.app.stage.addChild(this._red);
            }
        );
    }
}

let sb = new StarBoard();
sb.Initialise();

