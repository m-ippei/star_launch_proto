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
        //オーブの情報を格納　スプライトの座標と色の配置　座標は3*5 (配列内は{"x":0,"y":0}で初期化)
        this.OrbPositions = {};
        //中央の星
        this.Star = null;

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
        this.OrbPositions = {
            "pos":this._3x5Array.map((arr)=>arr.slice()),
            "color":this._3x5Array.map((arr)=>arr.slice())
        }

        //中央の星のグラフィックス情報
        this.Star = null;

        this.BoardInfo = {
            "message":{
                "text":"",
                "style":null,
                "texture":null,
                "update":false
            },
            "changeQueue":[],
            "connectMode":false
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
            "TextPosition":{
                "x":4.5,
                "y":3.5,
                "width":7,
                "height":3
            },
            "InnerCircleRadius":2.7,
            "OrbPositionCircleRadius":0.9,
            "OrbRadius":2
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
           [1.3613568165555772,5.550147021341967], //B 78°,318°
           [0.10471975511965977,4.293509959906051], //C 6°,246°
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

    /**
     * ユーティリティ関数
     * 描画可能範囲から横9ブロック・縦16ブロックの最大正方形で取った時の正方形の一辺の長さを取得
    */
    setLocalSize_9x16(width,height) {
        let _w = width / 9;
        let _y = height / 16;
        let _unitSize = Math.min(_w,_y);
        return Math.floor(_unitSize);
    }

    /**
     * ユーティリティ関数
     * 描画可能範囲と横9ブロック・縦16ブロックの最大正方形で取った時の余りの横サイズと縦サイズの1/2
     */
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
        
        let _tmpOrbPostions = this.OrbPositions.pos[0].map((v,i,a)=>{
            return {
                "x":_bc.x + (_cos(_ir[i])*(_bs.InnerCircleRadius - _bs.OrbPositionCircleRadius) * _ds.unitSize),
                "y":_bc.y + (-1*_sin(_ir[i])*(_bs.InnerCircleRadius - _bs.OrbPositionCircleRadius) * _ds.unitSize)
            }
        })

        this.OrbPositions.pos[0] = _tmpOrbPostions;

        const _or = this.OuterPositionCircleRad;

        _tmpOrbPostions = this.OrbPositions.pos[1].map((v,i,a)=>{
            return {
                "x":_icp[i].x + (_cos(_or[i][0])* _bs.OrbPositionCircleRadius * _ds.unitSize),
                "y":_icp[i].y + (-1*_sin(_or[i][0])* _bs.OrbPositionCircleRadius * _ds.unitSize)
            }
        })

        this.OrbPositions.pos[1] = _tmpOrbPostions;

        _tmpOrbPostions = this.OrbPositions.pos[2].map((v,i,a)=>{
            return {
                "x":_icp[i].x + (_cos(_or[i][1])* _bs.OrbPositionCircleRadius * _ds.unitSize),
                "y":_icp[i].y + (-1*_sin(_or[i][1])* _bs.OrbPositionCircleRadius * _ds.unitSize)
            }
        })

        this.OrbPositions.pos[2] = _tmpOrbPostions;

        this.Orb_InitialPositions = this.OrbPositions.pos.map((arr)=>arr.slice());
    }

    //描画設定
    setDraw() {
        this.BoardInfo.message.style = new PIXI.TextStyle({
            fontFamily: "Impact",
            fontSize: 200
        });
        this.BoardInfo.texture = new PIXI.Text(this.BoardInfo.message.text,this.BoardInfo.message.style);
        this.BoardInfo.texture.position.set(this.BoardScale.TextPosition.x*this.localBoardPosition.DrawSize.unitSize,this.BoardScale.TextPosition.y*this.localBoardPosition.DrawSize.unitSize);
        this.BoardInfo.texture.anchor.set(0.5,0.5);
        this.BoardInfo.texture.width = this.BoardScale.TextPosition.width * this.localBoardPosition.DrawSize.unitSize;
        this.BoardInfo.texture.height = this.BoardScale.TextPosition.height * this.localBoardPosition.DrawSize.unitSize;
        this.app.stage.addChild(this.BoardInfo.texture);

        this.Star = new PIXI.Graphics();

        this.Star.lineStyle(0);
        this.Star.beginFill(0xEDEAEC,1);
        this.Star.drawStar(this.localBoardPosition.BoardCenter.x,this.localBoardPosition.BoardCenter.y,5,this.localBoardPosition.DrawSize.unitSize*(this.BoardScale.InnerCircleRadius-this.BoardScale.OrbPositionCircleRadius));
        this.Star.interactive = true;
        this.Star.on("pointerdown",()=>{
            this.BoardInfo.connectMode = true;
            this.Star.clear();
            this.Star.lineStyle(0);
            this.Star.beginFill(0xFFDF00,1);
            this.Star.drawStar(this.localBoardPosition.BoardCenter.x,this.localBoardPosition.BoardCenter.y,5,this.localBoardPosition.DrawSize.unitSize*(this.BoardScale.InnerCircleRadius-this.BoardScale.OrbPositionCircleRadius));
        });
        this.Star.endFill();

        this.app.stage.addChild(this.Star);

        //オーブの描画
        PIXI.Loader.shared.add("images/orbs.json").load((loder, resources) => {
            
            const sheet = resources["images/orbs.json"].spritesheet;
           
            this.Orb = this.OrbColors.map((v,i,a)=>{
                return new PIXI.Sprite(sheet.textures[v]);
            })

            let _arr = this._3x5Array.map((arr)=>arr.slice());
            this.OrbPositions.color = _arr.map((v)=>{
                const tmpArr = v.map((v2)=>{
                    return this.OrbColors[Math.floor(Math.random()*this.OrbColors.length)];
                })
                return tmpArr;
            })

            this.sprites = this.OrbPositions.color.map((v,i,a)=>{
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
                        if(this.BoardInfo.connectMode === false){
                            this.BoardInfo.changeQueue.push(i2);
                        }
                    }));
                    v2.position.set(this.OrbPositions.pos[i][i2].x,this.OrbPositions.pos[i][i2].y);
                    v2.anchor.set(0.5,0.5);
                    v2.width = this.localBoardPosition.DrawSize.unitSize * this.BoardScale.OrbRadius;
                    v2.height = this.localBoardPosition.DrawSize.unitSize * this.BoardScale.OrbRadius;
                    this.app.stage.addChild(v2);
                })
            })


            }
        );
    }

    //アップデート設定
    setUpdate() {
        this.app.ticker.add((delta)=>{
            if(this.BoardInfo.changeQueue.length > 0){
                const vertex = this.BoardInfo.changeQueue.shift();
                const op = this.Orb_InitialPositions;

                [this.sprites[0][vertex],this.sprites[1][vertex],this.sprites[2][vertex]] = [this.sprites[2][vertex],this.sprites[0][vertex],this.sprites[1][vertex]];

                this.sprites.forEach((v,i,a)=>{
                    v.forEach((v2,i2,a2)=>{
                        v2.position.set(op[i][i2].x,op[i][i2].y);
                    })
                })
            }

            if(this.BoardInfo.connectMode){
                
                //星の頂点の色情報のみ保存する
                const _arr = this.sprites[0].map((v,i,a)=>{
                    return v._texture.textureCacheIds[0];
                });

                //星の頂点をオブジェクト形式で保存する
                const _lists = {};
                

                _arr.forEach((v,i,a)=>{
                    if(_lists.hasOwnProperty(v)){
                        _lists[v] += 1
                    }else{
                        _lists[v] = 1;
                    }
                })

                //オブジェクト形式にしたものを配列にする
                let _lists_arr = Object.entries(_lists);

                //同じ色が２つ以上あるものだけ残す。
                _lists_arr = _lists_arr.filter((v,i,a)=>{
                    return v[1] > 1;
                })

                //色の文字列だけにする。
                const _disable_arr = _lists_arr.map((v,i,a)=>{
                    return v[0];
                })

                this.sprites[0].forEach((v,i,a)=>{
                    _disable_arr.forEach((v2,i2,a2)=>{
                        if(v._texture.textureCacheIds[0] === v2){
                            v.visible = false;
                        }
                    })
                })

                this.BoardInfo.message.update = true;
                this.BoardInfo.message.text = "CLEAR!"

                this.BoardInfo.connectMode = false;


            }
        })

        this.app.ticker.add((delta)=>{
            if(this.BoardInfo.message.update){
                this.app.stage.removeChild(this.BoardInfo.texture);
                this.BoardInfo.message.style = new PIXI.TextStyle({
                    fontFamily: "Impact",
                    fontSize: 200
                });
                this.BoardInfo.texture = new PIXI.Text(this.BoardInfo.message.text,this.BoardInfo.message.style);
                this.BoardInfo.texture.position.set(this.BoardScale.TextPosition.x*this.localBoardPosition.DrawSize.unitSize,this.BoardScale.TextPosition.y*this.localBoardPosition.DrawSize.unitSize);
                this.BoardInfo.texture.anchor.set(0.5,0.5);
                this.BoardInfo.texture.width = this.BoardScale.TextPosition.width * this.localBoardPosition.DrawSize.unitSize;
                this.BoardInfo.texture.height = this.BoardScale.TextPosition.height * this.localBoardPosition.DrawSize.unitSize;
                this.app.stage.addChild(this.BoardInfo.texture);
                this.BoardInfo.message.update = false;
            }
        })
    }
}

let sb = new StarBoard();
sb.Initialise();
sb.setLocalize();
sb.setDraw();
sb.setUpdate();
console.log(sb);