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
        //オーブの全配置 3*5 (配列内は{"x":0,"y":0}で初期化)
        this.OrbPositions = [];

        //デバイスのための座標格納(定数・初期化後参照のみ)
        this.localBoardPosition = {}

        //デバイス非依存の座標スケール(定数・参照のみ)
        this.BoardScale = {};
        //オーブ配置のラジアン（定数・参照のみ）
        this.InnerCircleRad = [];
        //オーブ配置のラジアン (定数・参照のみ)
        this.OuterPositionCircleRad = [];
    }

    Initialise() {

        //2次配列の初期化テンプレート
        const _3x5Array = new Array(3).fill(new Array(5).fill(0));

        //空の2次配列で初期化
        this.sprites = _3x5Array.map((arr)=>arr.slice());
        this.colors = _3x5Array.map((arr)=>arr.slice());
        this.OrbPositions = _3x5Array.map((arr)=>arr.slice());

        //デバイス非依存の座標スケール(定数・参照のみ)
        this.BoardScale = {
            "CENTER":{
                "x":4.5,
                "y":11.5
            },
            "InnerCircleRadius":2.5,
            "OrbPositionCircleRadius":1,
            "OrbRadius":0.6
        }

        //デバイスのための座標格納
        this.localBoardPosition = {
            "DrawSize":{
                "TopWidth":0,
                "TopHeight":0,
                "unitSize":0
            },
            "BoardCenter":{
                "x":0,
                "y":0
            },
            "InnerCircleCenterPosition":{
                "x":0,
                "y":0
            }
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

        //ウィンドウサイズのエイリアス
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        //描画初期化処理
        this.app = new PIXI.Application({
            width:this.width,
            height:this.height,
            backgroundColor:0xffffe0
        });

        //全画面設定
        this.app.view.style.position = "absolute";
        this.app.renderer.view.style.display = "block";
        this.app.renderer.autoDensity = true;
        this.app.resize(this.width,this.height);

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

    //ユーティリティ関数
    //描画可能範囲から横9ブロック・縦16ブロックの最大正方形で取った時の正方形の一辺の長さを取得
    setLocalSize_9x16(width,height) {
        let _w = width / 9;
        let _y = height / 16;
        let _unitSize = Math.min(_w,_y);
        return Math.floor(_unitSize);
    }

    //ユーティリティ関数
    //描画可能範囲と横9ブロック・縦16ブロックの最大正方形で取った時の余りの横サイズと縦サイズの1/2
    returnleftTopANDRightTop_9x16(width,height,unitSize) {
        let rmW = width - (unitSize * 9);
        let rmH = height - (unitSize * 16);
        return [rmW/2,rmH/2];
    }

    //デバイス固有の座標群設定
    setLoacalize() {

        this.localBoardPosition.DrawSize.unitSize = setLocalSize_9x16(this.width,this.height);
        const _arr = returnleftTopANDRightTop_9x16(this.width,this.height,this.localBoardPosition.DrawSize.unitSize);
        this.localBoardPosition.DrawSize.TopWidth = _arr[0];
        this.localBoardPosition.DrawSize.TopHeight = _arr[1];

        
    }
}

let sb = new StarBoard();
sb.Initialise();
sb.setLoacalize();
