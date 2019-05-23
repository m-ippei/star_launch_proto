PIXI.Loader.shared.add("images/sprites.json").load((loader,resources)=>{
    SHEET = resources["images/sprites.json"].spritesheet;

    SOUNDS.change = new Howl({
        src:['sound/change.mp3']
    });
    SOUNDS.single = new Howl({
        src:['sound/single.mp3']
    });
    SOUNDS.double = new Howl({
        src:['sound/double.mp3']
    });
    SOUNDS.o3 = new Howl({
        src:['sound/3orb.mp3']
    });
    SOUNDS.o4 = new Howl({
        src:['sound/4orb.mp3']
    });
    SOUNDS.mixstar = new Howl({
        src:['sound/mixstar.mp3']
    });
    SOUNDS.star = new Howl({
        src:['sound/star.mp3']
    });
    SOUNDS.bgm = new Howl({
        src:['sound/bgm.mp3'],
        volume:0.3
    });
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
        backgroundColor:0xbbbeca,
        antialias:true
    });

    //全画面設定
    app.view.style.position = "absolute";
    app.renderer.autoDensity = true;
    app.resize(WIDTH,HEIGHT);

    app.renderer.view.id = name;
    app.renderer.view.hidden = isHidden;

    return app;
}