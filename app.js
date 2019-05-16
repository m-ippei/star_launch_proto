
/**
 * SETTINGS
 */

let BOARDINFO = {
    "message":{
        "text":"",
        "style":null,
        "texture":null,
        "update":false,
        "text_style":{
            align:"center",
            fontFamily: "Kosugi Maru",
            fontSize: 200,
            wordWrap:true
        }
    },
    "changeQueue":[],
    "connectMode":false
}

const ORBCOLORS = [
    "blue.png",
    "green.png",
    "purple.png",
    "red.png",
    "water.png",
    "yellow.png"
];

//デバイス非依存の座標スケール(定数・参照のみ)
const BOARDSCALE = {
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
let LOCALBOARDPOSITION = {
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


//public valiables

//スプライト情報格納 3*5
let SPRITES = [];
//オーブの配置情報を格納　座標は3*5 (配列内は{"x":0,"y":0}で初期化)
let ORBPOSITIONS = [];

//ウィンドウサイズのエイリアス
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;


/**
 * オーブ配置の計算済ラジアン (定数・参照のみ)
 */

const INNERCIRCLE_RAD = [
    1.5707963267948966, //A 90°
    0.3141592653589793, //B 18°
    5.340707511102648, //C 306°
    4.084070449666731, //D 234°
    2.827433388230814 //E 162°
];

const OUTERPOSITIONCICLE_RAD = [
    [2.6179938779914944,0.5235987755982988], //A 150°,30°
    [1.3613568165555772,5.550147021341967], //B 78°,318°
    [0.10471975511965977,4.293509959906051], //C 6°,246°
    [5.1312680008633285,3.036872898470133], //D 294°,174°
    [3.8746309394274117,1.780235837034216] //E 222°,102°
 ];



//public utils
const util_3x5Array = new Array(3).fill(new Array(5).fill(0));

/**
* public 
* ユーティリティ関数
*/

//描画可能範囲から横9ブロック・縦16ブロックの最大正方形で取った時の正方形の一辺の長さを取得
//引数 横幅,縦幅
//返り値　単位長
function setLocalSize_9x16(width,height) {
    let _w = width / 9;
    let _y = height / 16;
    let _unitSize = Math.min(_w,_y);
    return Math.floor(_unitSize);
}

//描画可能範囲と横9ブロック・縦16ブロックの最大正方形で取った時の余りの横サイズと縦サイズの1/2
//引数　横幅,縦幅,単位長
//返り値　左上の座標
function returnleftTopANDRightTop_9x16(width,height,unitSize) {
    let rmW = width - (unitSize * 9);
    let rmH = height - (unitSize * 16);
    return [rmW/2,rmH/2];
}



class StarBoard{
    constructor(){
        //中央の星
        this.Star = null;
        //オーブの初期位置の保持
        this.Orb_InitialPositions;
    }

    Initialize() {
        //nullまたは0の2次配列で初期化
        SPRITES = util_3x5Array.map((arr)=>arr.slice().fill(null));
        ORBPOSITIONS = util_3x5Array.map((arr)=>arr.slice());

        //中央の星のグラフィックス情報
        this.Star = null;

        //描画初期化処理
        this.app = new PIXI.Application({
            width:WIDTH,
            height:HEIGHT,
            backgroundColor:0xffffe0,
            antialias:true
        });

        //全画面設定
        this.app.view.style.position = "absolute";
        this.app.renderer.view.style.display = "block";
        this.app.renderer.autoDensity = true;
        this.app.resize(WIDTH,HEIGHT);

        document.body.appendChild(this.app.view);
    }
    //デバイス固有の座標群設定
    setLocalize() {
        
        const _ds = LOCALBOARDPOSITION.DrawSize;
        _ds.unitSize = setLocalSize_9x16(WIDTH,HEIGHT);
        const _arr = returnleftTopANDRightTop_9x16(WIDTH,HEIGHT,_ds.unitSize);
        _ds.TopWidth = _arr[0];
        _ds.TopHeight = _arr[1];

        const _bc = LOCALBOARDPOSITION.BoardCenter;
        const _bs = BOARDSCALE;

        _bc.x = _ds.TopWidth + (_bs.CENTER.x * _ds.unitSize);
        _bc.y = _ds.TopHeight + (_bs.CENTER.y * _ds.unitSize);

        let _icp = LOCALBOARDPOSITION.InnerCircleCenterPosition;
        const _ir = INNERCIRCLE_RAD;
        const _cos = Math.cos;
        const _sin = Math.sin;

        const _tmpIPOS = _icp.map((v,i,a)=>{
            return {
                "x":_bc.x + (_cos(_ir[i])*_bs.InnerCircleRadius*_ds.unitSize),
                "y":_bc.y + (-1*_sin(_ir[i])*_bs.InnerCircleRadius*_ds.unitSize)
            }
        });

        LOCALBOARDPOSITION.InnerCircleCenterPosition = _tmpIPOS;
        _icp = LOCALBOARDPOSITION.InnerCircleCenterPosition;
        
        let _tmpOrbPostions = ORBPOSITIONS[0].map((v,i,a)=>{
            return {
                "x":_bc.x + (_cos(_ir[i])*(_bs.InnerCircleRadius - _bs.OrbPositionCircleRadius) * _ds.unitSize),
                "y":_bc.y + (-1*_sin(_ir[i])*(_bs.InnerCircleRadius - _bs.OrbPositionCircleRadius) * _ds.unitSize)
            }
        })

        ORBPOSITIONS[0] = _tmpOrbPostions;

        const _or = OUTERPOSITIONCICLE_RAD;

        _tmpOrbPostions = ORBPOSITIONS[1].map((v,i,a)=>{
            return {
                "x":_icp[i].x + (_cos(_or[i][0])* _bs.OrbPositionCircleRadius * _ds.unitSize),
                "y":_icp[i].y + (-1*_sin(_or[i][0])* _bs.OrbPositionCircleRadius * _ds.unitSize)
            }
        })

        ORBPOSITIONS[1] = _tmpOrbPostions;

        _tmpOrbPostions = ORBPOSITIONS[2].map((v,i,a)=>{
            return {
                "x":_icp[i].x + (_cos(_or[i][1])* _bs.OrbPositionCircleRadius * _ds.unitSize),
                "y":_icp[i].y + (-1*_sin(_or[i][1])* _bs.OrbPositionCircleRadius * _ds.unitSize)
            }
        })

        ORBPOSITIONS[2] = _tmpOrbPostions;

        this.Orb_InitialPositions = ORBPOSITIONS.map((arr)=>arr.slice());
    }

    //描画設定
    setDraw() {
        BOARDINFO.message.style = new PIXI.TextStyle(BOARDINFO.message.text_style);
        BOARDINFO.texture = new PIXI.Text(BOARDINFO.message.text,BOARDINFO.message.style);
        BOARDINFO.texture.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth+(BOARDSCALE.TextPosition.x*LOCALBOARDPOSITION.DrawSize.unitSize),LOCALBOARDPOSITION.DrawSize.TopHeight+(BOARDSCALE.TextPosition.y*LOCALBOARDPOSITION.DrawSize.unitSize));
        BOARDINFO.texture.anchor.set(0.5,0.5);
        BOARDINFO.texture.width = BOARDSCALE.TextPosition.width * LOCALBOARDPOSITION.DrawSize.unitSize;
        BOARDINFO.texture.height = BOARDSCALE.TextPosition.height * LOCALBOARDPOSITION.DrawSize.unitSize;
        this.app.stage.addChild(BOARDINFO.texture);

        this.Star = new PIXI.Graphics();

        this.Star.lineStyle(0);
        this.Star.beginFill(0xEDEAEC,1);
        this.Star.drawStar(LOCALBOARDPOSITION.BoardCenter.x,LOCALBOARDPOSITION.BoardCenter.y,5,LOCALBOARDPOSITION.DrawSize.unitSize*(BOARDSCALE.InnerCircleRadius-BOARDSCALE.OrbPositionCircleRadius));
        this.Star.interactive = true;
        this.Star.on("pointerdown",()=>{
            BOARDINFO.connectMode = true;
            this.Star.clear();
            this.Star.lineStyle(0);
            this.Star.beginFill(0xFFDF00,1);
            this.Star.drawStar(LOCALBOARDPOSITION.BoardCenter.x,LOCALBOARDPOSITION.BoardCenter.y,5,LOCALBOARDPOSITION.DrawSize.unitSize*(BOARDSCALE.InnerCircleRadius-BOARDSCALE.OrbPositionCircleRadius));
        });
        this.Star.endFill();

        this.app.stage.addChild(this.Star);

        //オーブの描画
        PIXI.Loader.shared.add("images/orbs.json").load((loder, resources) => {
            
            const sheet = resources["images/orbs.json"].spritesheet;
           
            let _arr = util_3x5Array.map((arr)=>arr.slice());
            let _color = _arr.map((v)=>{
                const tmpArr = v.map((v2)=>{
                    return ORBCOLORS[Math.floor(Math.random()*ORBCOLORS.length)];
                })
                return tmpArr;
            })

            SPRITES = _color.map((v,i,a)=>{
                const tmpArr = v.map((v2,i2,a2)=>{
                    const sprite = new PIXI.Sprite(sheet.textures[v2]);
                    return sprite;
                })
                return tmpArr;
            })

            SPRITES.forEach((v,i,a)=>{
                v.forEach((v2,i2,a2)=>{
                    v2.interactive = true;
                    v2.on("pointerdown",(()=>{
                        if(BOARDINFO.connectMode === false){
                            BOARDINFO.changeQueue.push(i2);
                        }
                    }));
                    v2.position.set(ORBPOSITIONS[i][i2].x,ORBPOSITIONS[i][i2].y);
                    v2.anchor.set(0.5,0.5);
                    v2.width = LOCALBOARDPOSITION.DrawSize.unitSize * BOARDSCALE.OrbRadius;
                    v2.height = LOCALBOARDPOSITION.DrawSize.unitSize * BOARDSCALE.OrbRadius;
                    this.app.stage.addChild(v2);
                })
            })


            }
        );
    }

    //アップデート設定
    setUpdate() {
        this.app.ticker.add((delta)=>{
            if(BOARDINFO.changeQueue.length > 0){
                const vertex = BOARDINFO.changeQueue.shift();
                const op = this.Orb_InitialPositions;

                [SPRITES[0][vertex],SPRITES[1][vertex],SPRITES[2][vertex]] = [SPRITES[2][vertex],SPRITES[0][vertex],SPRITES[1][vertex]];

                SPRITES.forEach((v,i,a)=>{
                    v.forEach((v2,i2,a2)=>{
                        v2.position.set(op[i][i2].x,op[i][i2].y);
                    })
                })
            }

            if(BOARDINFO.connectMode){
                
                //星の頂点の色情報のみ保存する
                const _arr = SPRITES[0].map((v,i,a)=>{
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

                SPRITES[0].forEach((v,i,a)=>{
                    _disable_arr.forEach((v2,i2,a2)=>{
                        if(v._texture.textureCacheIds[0] === v2){
                            v.visible = false;
                        }
                    })
                })

                BOARDINFO.message.update = true;
                BOARDINFO.message.text = "CLEAR!"

                BOARDINFO.connectMode = false;


            }
        })

        this.app.ticker.add((delta)=>{
            if(BOARDINFO.message.update){
                this.app.stage.removeChild(BOARDINFO.texture);
                BOARDINFO.message.style = new PIXI.TextStyle(BOARDINFO.message.text_style);
                BOARDINFO.texture = new PIXI.Text(BOARDINFO.message.text,BOARDINFO.message.style);
                BOARDINFO.texture.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth+(BOARDSCALE.TextPosition.x*LOCALBOARDPOSITION.DrawSize.unitSize),LOCALBOARDPOSITION.DrawSize.TopHeight+(BOARDSCALE.TextPosition.y*LOCALBOARDPOSITION.DrawSize.unitSize));
                BOARDINFO.texture.anchor.set(0.5,0.5);
                BOARDINFO.texture.width = BOARDSCALE.TextPosition.width * LOCALBOARDPOSITION.DrawSize.unitSize;
                BOARDINFO.texture.height = BOARDSCALE.TextPosition.height * LOCALBOARDPOSITION.DrawSize.unitSize;
                this.app.stage.addChild(BOARDINFO.texture);
                BOARDINFO.message.update = false;
            }
        })
    }
}

let sb = new StarBoard();
sb.Initialize();
sb.setLocalize();
sb.setDraw();
sb.setUpdate();
console.log(sb);




/** メモ
* データ構造について
* 配列が3*5の時
* 
* 例
* let a = [
*    [0,0,0,0,0]
*    [0,0,0,0,0],
*    [0,0,0,0,0]
*    ]
* 
*   a[i][j]のiは星の深さ、jは星の位置
*/


/**
 *  ______A______
 *  _____■■■_____
 *  __■_■■■■■_■__
 *  E■■■■■■■■■■■B
 *  __■■■■■■■■■__
 *  ___■■___■■___
 *  ___D_____C___
*/

        
