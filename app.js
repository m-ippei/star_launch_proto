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

let message = new PIXI.Text(WIDTH.toString()+"  "+HEIGHT.toString());
app.stage.addChild(message);

message.position.set(100,100);

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


