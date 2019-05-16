function Initialize() {
    //nullまたは0の2次配列で初期化
    SPRITES = util_3x5Array.map((arr)=>arr.slice().fill(null));
    ORBPOSITIONS = util_3x5Array.map((arr)=>arr.slice());

    //描画初期化処理
    APP = new PIXI.Application({
        width:WIDTH,
        height:HEIGHT,
        backgroundColor:0xffffe0,
        antialias:true
    });

    //全画面設定
    APP.view.style.position = "absolute";
    APP.renderer.view.style.display = "block";
    APP.renderer.autoDensity = true;
    APP.resize(WIDTH,HEIGHT);

    document.body.appendChild(APP.view);
}