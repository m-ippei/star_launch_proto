/*
class StarBoard{
    constructor(){
        //Initialize();
        //setLocalize();
        //setDraw();
        //setUpdate();
    }
}

//let sb = new StarBoard();

*/

PIXI.Loader.shared.onComplete.add(()=>{
    //初期化処理
    TITLE = Initialize("title",false);
    //MAIN = Initialize("main",false);
    //RESULT = Initialize("result",true);

    title();
    //main();
    //result();

})
