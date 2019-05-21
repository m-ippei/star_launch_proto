/*
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
*/


PIXI.Loader.shared.add("images/sprites.json").load((loader,resources)=>{
    sheet = resources["images/sprites.json"].spritesheet;
});



/**
 * 初期化処理
 * @param {function} app 
 * @param {string} name 
 * @param {boolean} isHidden 
 */
function Initialize(name,isHidden){
    //描画初期化処理
    const app = new PIXI.Application({
        width:WIDTH,
        height:HEIGHT,
        backgroundColor:0xffffe0,
        antialias:true
    });

    //全画面設定
    app.view.style.position = "absolute";
    //app.renderer.view.style.display = "block";
    app.renderer.autoDensity = true;
    app.resize(WIDTH,HEIGHT);

    app.renderer.view.id = name;
    app.renderer.view.hidden = isHidden;

    

    return app;
}