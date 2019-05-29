PIXI.Loader.shared.onComplete.add(() => {
    //初期化処理
    TITLE = Initialize("title", false);
    MAIN = Initialize("main", true);
    RESULT = Initialize("result", true);

    setLocalize();

    //4_SCENE.js
    title();
    main();
    result();

    setUpdate();
})