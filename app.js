const app = new PIXI.Application({ antialias: true });
document.body.appendChild(app.view);

const graphics = new PIXI.Graphics();

// Circle
graphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
graphics.beginFill(0xDE3249, 1);
graphics.drawCircle(100, 250, 50);
graphics.endFill();

app.stage.addChild(graphics);
