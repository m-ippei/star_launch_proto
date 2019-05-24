/**
 * SETTINGS
 * 定数
 */

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
    "OrbRadius":1.4
}

/**
 * SETTINGS
 * 定数 読み取り専用
 */

 /**
 * オーブ配置の計算済ラジアン 
 */

const INNERCIRCLE_RAD = [
    1.5707963267948966, //A 90°
    0.3141592653589793, //B 18°
    5.340707511102648, //C 306°
    4.084070449666731, //D 234°
    2.827433388230814 //E 162°
];

const OUTERPOSITIONCICLE_RAD = [
    [2.6179938779914944,0.5235987755982988,4.71238898038469], //A 150°,30°,270°
    [1.3613568165555772,5.550147021341967,3.455751918948773], //B 78°,318°,198°
    [0.10471975511965977,4.293509959906051,2.199114857512855], //C 6°,246°,126°
    [5.1312680008633285,3.036872898470133,0.9424777960769379], //D 294°,174°,54°
    [3.8746309394274117,1.780235837034216,5.969026041820607] //E 222°,102°,342°
 ];

 /**
 * SETTINGS
 * 変数　構造化データ
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
            fontSize: 120,
            lineHeight:130,
            fill:['#f4f2db','#ffffff'],
        }
    },
    "SCORE":{
        "score":0,
        "style":null,
        "texture":null,
        "update":false,
        "text_style":{
            align:"center",
            lineHeight:90,
            fontFamily: "Kosugi Maru",
            fontSize: 90,
            fill:['#f4f2db','#ffffff'],
        }
    },
    "TIME":{
        "time":30,
        "texture":null,
        "update":false,
        "point":0,
        "style":{
            fontFamily: "Kosugi Maru",
            fontSize: 80,
            fill:['#f4f2db','#ffffff'],
            wordWrap:true
        }
    },
    "COUNTER":{
        "single":0,
        "double":0,
        "o3":0,
        "o4":0,
        "star":0,
        "o23":0
    },
    "changeQueue":[],
    "connectMode":false
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

//内部テキスト更新管理
let __systemTimer = {
    "count":0,
    "update":false
}

/**
 * オーブ回転・エフェクト
 * 変数 構造化データ
 */
//オーブの回転と移動処理の変数保存
let _sysOrbChange = {
    //定数
    "DEGREE120toRAD":2.0943951023931953,

    //変数
    //交換する頂点での各ラジアンが入る
    "_tmp_rotate_rad":[0,0,0],
    //更新当たりの増加量
    "addRadStep":0.1,
    //更新する合計 度数法120°のラジアン
    "radTotal":2.0943951023931953,
    //処理中の星の頂点
    "changeValue":null,

    //状態管理
    "changed":{
        //readyは準備完了かどうか。trueで初期化完了、falseで処理中。
        "ready":true,
        
        //以下readyがfalseの時の状態管理。上から順番にtrueが移り、最後まで行くとすべてfalse;
        "effect":false,
        "effectDone":false,
        "change":false
    }
}

/**
 * SETTINGS
 * 変数　単体
 */

//シーン
let TITLE = null;
let MAIN = null;
let RESULT = null;

//スプライト情報格納 3*5
let SPRITES = [];
//オーブの配置情報を格納　座標は3*5 (配列内は{"x":0,"y":0}で初期化)
let ORBPOSITIONS = [];
//星のグラフィック情報
let STAR = null;
//星の初期位置保存
let ORB_INITIALPOSITIONS = [];




//定数

// spritesheetの画像データ
let SHEET = null;

//音データ
let SOUNDS = {
    "change":null,
    "single":null,
    "double":null,
    "o3":null,
    "o4":null,
    "mixstar":null,
    "star":null,
    "bgm":null
}

//ウィンドウサイズのエイリアス
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

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

        
