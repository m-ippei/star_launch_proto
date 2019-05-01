const sprites = {};
const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight;
const CENTER = {};
CENTER.x = WIDTH / 2;
CENTER.y = HEIGHT / 2;

const app = new PIXI.Application({
    width:WIDTH,
    height:HEIGHT,
    backgroundColor:0xffffe0
});

app.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
app.renderer.resize(window.innerWidth,window.innerHeight);

document.body.appendChild(app.view);

PIXI.Loader.shared.add("images/orbs.json").load(setup);

function setup() {
    let sheet = PIXI.Loader.shared.resources["images/orbs.json"].spritesheet;
    sprites.red = new PIXI.Sprite(sheet.textures["red.png"]);
    sprites.red.position.set(CENTER.x,CENTER.y);
    sprites.red.anchor.set(0.5,0.5);
    app.stage.addChild(sprites.red);
}

/*

app.loader.add("orbs","images/orbs.json").load((loader,resources)=>{
    let sheet = resources["images/orbs.json"]
    sprites.red = new PIXI.Sprite(sheet.textures["red.png"])
    sprites.red.position.set(CENTER.x,CENTER.y);
    app.stage.addChild(sprites.red);
    
    const orbs = new PIXI.Sprite(resources.orbs.texture);
    orbs.x = CENTER.x;
    orbs.y = CENTER.y;

    app.stage.addChild(orbs);
    
})

*/