PIXI.Loader.shared.onComplete.add(()=>{
    //初期化処理
    TITLE = Initialize("title",true);
    MAIN = Initialize("main",false);
    RESULT = Initialize("result",true);

    setLocalize();

    title();
    main();
    result();

    setUpdate();

})
