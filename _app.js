let queue = 0;

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

        //スプライト情報格納 3*5
        this.sprites = [];
        //色情報の格納 3*5
        this.colors = [];
        //オーブの全配置 3*5 (配列内は{"x":0,"y":0}で初期化)
        this.OrbPositions = [];

        //デバイスのための座標格納(定数・初期化後参照のみ)
        this.localBoardPosition = {};

        //ボード情報
        this.BoardInfo = {};
        //オーブの色　ファイル名（参照のみ）
        this.OrbColors = [];
        //参照オーブスプライトの格納
        this.Orb = [];
        //オーブの初期位置の保持
        this.Orb_InitialPositions;
        //デバイス非依存の座標スケール(定数・参照のみ)
        this.BoardScale = {};
        //オーブ配置のラジアン（定数・参照のみ）
        this.InnerCircleRad = [];
        //オーブ配置のラジアン (定数・参照のみ)
        this.OuterPositionCircleRad = [];
        
    }

    Initialise() {

        //2次配列の初期化テンプレート
        this._3x5Array = new Array(3).fill(new Array(5).fill(0));

        //nullまたは0の2次配列で初期化
        this.sprites = this._3x5Array.map((arr)=>arr.slice().fill(null));
        this.colors = this._3x5Array.map((arr)=>arr.slice());
        this.OrbPositions = this._3x5Array.map((arr)=>arr.slice());

        this.BoardInfo = {
            "changeQueue":[],
            "count":0
        }

        this.OrbColors = [
            "blue.png",
            "green.png",
            "purple.png",
            "red.png",
            "water.png",
            "yellow.png"
        ];

        //デバイス非依存の座標スケール(定数・参照のみ)
        this.BoardScale = {
            "CENTER":{
                "x":4.5,
                "y":11.5
            },
            "InnerCircleRadius":2.7,
            "OrbPositionCircleRadius":0.9,
            "OrbRadius":1.4
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
            "InnerCircleCenterPosition":[
                {"x":0,"y":0}, //A
                {"x":0,"y":0}, //B
                {"x":0,"y":0}, //C
                {"x":0,"y":0}, //D
                {"x":0,"y":0} //E
            ]
        }

        /**
         ______A______
         _____■■■_____
         __■_■■■■■_■__
         E■■■■■■■■■■■B
         __■■■■■■■■■__
         ___■■___■■___
         ___D_____C___
         */

        this.InnerCircleRad = [
            1.5707963267948966, //A 90°
            0.3141592653589793, //B 18°
            5.340707511102648, //C 306°
            4.084070449666731, //D 234°
            2.827433388230814 //E 162°
        ];
        this.OuterPositionCircleRad = [
            [2.6179938779914944,0.5235987755982988], //A 150°,30°
            [5.550147021341967,1.3613568165555772], //B 318°,78°
            [4.293509959906051,0.10471975511965977], //C 246°,6°
            [5.1312680008633285,3.036872898470133], //D 294°,174°
            [3.8746309394274117,1.780235837034216] //E 222°,102°
        ];

        //ウィンドウサイズのエイリアス
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        //描画初期化処理
        this.app = new PIXI.Application({
            width:this.width,
            height:this.height,
            backgroundColor:0xffffe0,
            antialias:true
        });

        //全画面設定
        this.app.view.style.position = "absolute";
        this.app.renderer.view.style.display = "block";
        this.app.renderer.autoDensity = true;
        this.app.resize(this.width,this.height);

        document.body.appendChild(this.app.view);
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
    setLocalize() {
        
        const _ds = this.localBoardPosition.DrawSize;
        _ds.unitSize = this.setLocalSize_9x16(this.width,this.height);
        const _arr = this.returnleftTopANDRightTop_9x16(this.width,this.height,_ds.unitSize);
        _ds.TopWidth = _arr[0];
        _ds.TopHeight = _arr[1];

        const _bc = this.localBoardPosition.BoardCenter;
        const _bs = this.BoardScale;

        _bc.x = _ds.TopWidth + (_bs.CENTER.x * _ds.unitSize);
        _bc.y = _ds.TopHeight + (_bs.CENTER.y * _ds.unitSize);

        let _icp = this.localBoardPosition.InnerCircleCenterPosition;
        const _ir = this.InnerCircleRad;
        const _cos = Math.cos;
        const _sin = Math.sin;

        const _tmpIPOS = _icp.map((v,i,a)=>{
            return {
                "x":_bc.x + (_cos(_ir[i])*_bs.InnerCircleRadius*_ds.unitSize),
                "y":_bc.y + (-1*_sin(_ir[i])*_bs.InnerCircleRadius*_ds.unitSize)
            }
        });

        this.localBoardPosition.InnerCircleCenterPosition = _tmpIPOS;
        _icp = this.localBoardPosition.InnerCircleCenterPosition;
        
        let _tmpOrbPostions = this.OrbPositions[0].map((v,i,a)=>{
            return {
                "x":_bc.x + (_cos(_ir[i])*(_bs.InnerCircleRadius - _bs.OrbPositionCircleRadius) * _ds.unitSize),
                "y":_bc.y + (-1*_sin(_ir[i])*(_bs.InnerCircleRadius - _bs.OrbPositionCircleRadius) * _ds.unitSize)
            }
        })

        this.OrbPositions[0] = _tmpOrbPostions;

        const _or = this.OuterPositionCircleRad;

        _tmpOrbPostions = this.OrbPositions[1].map((v,i,a)=>{
            return {
                "x":_icp[i].x + (_cos(_or[i][0])* _bs.OrbPositionCircleRadius * _ds.unitSize),
                "y":_icp[i].y + (-1*_sin(_or[i][0])* _bs.OrbPositionCircleRadius * _ds.unitSize)
            }
        })

        this.OrbPositions[1] = _tmpOrbPostions;

        _tmpOrbPostions = this.OrbPositions[2].map((v,i,a)=>{
            return {
                "x":_icp[i].x + (_cos(_or[i][1])* _bs.OrbPositionCircleRadius * _ds.unitSize),
                "y":_icp[i].y + (-1*_sin(_or[i][1])* _bs.OrbPositionCircleRadius * _ds.unitSize)
            }
        })

        this.OrbPositions[2] = _tmpOrbPostions;

        this.Orb_InitialPositions = this.OrbPositions.map((arr)=>arr.slice());
    }

    

    setDraw() {
        PIXI.Loader.shared.add("images/orbs.json").load((loder, resources) => {
            
            const sheet = resources["images/orbs.json"].spritesheet;
           
            this.Orb = this.OrbColors.map((v,i,a)=>{
                return new PIXI.Sprite(sheet.textures[v]);
            })

            let _arr = this._3x5Array.map((arr)=>arr.slice());
            const _randomColors = _arr.map((v)=>{
                const tmpArr = v.map((v2)=>{
                    return this.OrbColors[Math.floor(Math.random()*this.OrbColors.length)];
                })
                return tmpArr;
            })

            this.sprites = _randomColors.map((v,i,a)=>{
                const tmpArr = v.map((v2,i2,a2)=>{
                    const sprite = new PIXI.Sprite(sheet.textures[v2]);
                    return sprite;
                })
                return tmpArr;
            })

            this.sprites.forEach((v,i,a)=>{
                v.forEach((v2,i2,a2)=>{
                    v2.interactive = true;
                    v2.on("pointerdown",(()=>{
                        this.BoardInfo.changeQueue.push(i);
                        //console.log(this.BoardInfo.changeQueue);
                    }));
                    v2.position.set(this.OrbPositions[i][i2].x,this.OrbPositions[i][i2].y);
                    v2.anchor.set(0.5,0.5);
                    v2.width = this.localBoardPosition.DrawSize.unitSize * this.BoardScale.OrbRadius;
                    v2.height = this.localBoardPosition.DrawSize.unitSize * this.BoardScale.OrbRadius;
                    this.app.stage.addChild(v2);
                })
            })


            }
        );
    }

    setUpdate() {
        this.app.ticker.add((delta)=>{
            if(this.BoardInfo.changeQueue.length > 0){
                //console.log(this.BoardInfo.changeQueue);
                //console.log("a");
                //console.log(this.BoardInfo.changeQueue);
                const vertex = this.BoardInfo.changeQueue.shift();
                //console.log(this.BoardInfo.changeQueue);
                console.log(this.OrbPositions);
                

                [this.OrbPositions[0][vertex],this.OrbPositions[1][vertex],this.OrbPositions[2][vertex]] = [this.OrbPositions[1][vertex],this.OrbPositions[2][vertex],this.OrbPositions[0][vertex]]
                
                console.log(this.OrbPositions);
                //console.log(this.BoardInfo.changeQueue);
                //console.log(this.BoardInfo.changeQueue);

                this.sprites.forEach((v,i,a)=>{
                    v.forEach((v2,i2,a2)=>{
                        v2.position.set(this.OrbPositions[i][i2].x,this.OrbPositions[i][i2].y);
                    })
                })
            }
            /*
            while(queue.length > 0){
                let vertex =    queue.shift();
                [this.OrbPositions[0][vertex],this.OrbPositions[1][vertex],this.OrbPositions[2][vertex]] = [this.OrbPositions[1][vertex],this.OrbPositions[2][vertex],this.OrbPositions[0][vertex]]
                /*
                let vertex = null;

        if(this.BoardInfo.ChangeQueue.length > 0){
            vertex = this.BoardInfo.ChangeQueue.shift();
        }

       [this.OrbPositions[0][vertex],this.OrbPositions[1][vertex],this.OrbPositions[2][vertex]] = [this.OrbPositions[1][vertex],this.OrbPositions[2][vertex],this.OrbPositions[0][vertex]]
                
            }

            if(queue.length > 0){
                this.sprites.forEach((v,i,a)=>{
                    v.forEach((v2,i2,a2)=>{
                        v2.position.set(this.OrbPositions[i][i2].x,this.OrbPositions[i][i2].y);
                    })
                })
            }
           */ 
        })
        
    }
}

let sb = new StarBoard();
sb.Initialise();
sb.setLocalize();
sb.setDraw();
sb.setUpdate();
console.log(sb);