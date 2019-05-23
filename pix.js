let sheet = null;
let title = null;
let main = null;
const PIX = document.getElementById("pix");



PIXI.Loader.shared.add("images/sprites.json").load((loader,resources)=>{
    sheet = resources["images/sprites.json"].spritesheet;
});

PIXI.Loader.shared.onComplete.add(()=>{
    init();
    a();
    b();
})

function init() {
    title = new PIXI.Application({ backgroundColor: 0x1099bb });
    main = new PIXI.Application({ backgroundColor: 0x1099bb });
}

function a(){
    const sprite = new PIXI.Sprite(sheet.textures["red.png"]);

    title.renderer.view.id = "title"
    title.renderer.view.hidden = false;

    sprite.interactive = true;
    sprite.on('pointerdown',()=>{
        title.renderer.view.hidden = true;
        main.renderer.view.hidden = false;
        //const APP = document.getElementById("app");
        //APP.setAttribute("hidden","hidden");
        app.message = "Good?"
    })

    PIX.appendChild(title.view);
    title.stage.addChild(sprite);
}

function b(){
    const sprite = new PIXI.Sprite(sheet.textures["blue.png"]);

    main.renderer.view.id = "main"
    main.renderer.view.hidden = true;

    sprite.interactive = true;
    sprite.on('pointerdown',()=>{
        title.renderer.view.hidden = false;
        main.renderer.view.hidden = true;
        //const APP = document.getElementById("app");
        //APP.removeAttribute("hidden");
    })

    sprite.position.set(200,200);

    PIX.appendChild(main.view);
    main.stage.addChild(sprite);
}


