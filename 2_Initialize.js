PIXI.Loader.shared.add("images/sprites.json").load((loader,resources)=>{
    SHEET = resources["images/sprites.json"].spritesheet;
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