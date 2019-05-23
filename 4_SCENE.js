function title(){
    
    const bg = new PIXI.Sprite(SHEET.textures["title_back.png"]);
    const logo = new PIXI.Sprite(SHEET.textures["title.png"]);
    const start = new PIXI.Sprite(SHEET.textures["tap_start.png"]);
    
    logo.interactive = true;
    logo.on('pointerdown',()=>{
        TITLE.renderer.view.hidden = true;
        MAIN.renderer.view.hidden = false;
        BOARDINFO.TIME.update = true;
    })

    bg.interactive = true;
    bg.on('pointerdown',()=>{
        TITLE.renderer.view.hidden = true;
        MAIN.renderer.view.hidden = false;
        BOARDINFO.TIME.update = true;
    })

    start.interactive = true;
    start.on('pointerdown',()=>{
        TITLE.renderer.view.hidden = true;
        MAIN.renderer.view.hidden = false;
        BOARDINFO.TIME.update = true;
    })

    logo.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth,LOCALBOARDPOSITION.DrawSize.TopHeight);
    logo.width = LOCALBOARDPOSITION.DrawSize.unitSize * 9;
    logo.height = LOCALBOARDPOSITION.DrawSize.unitSize * 9;

    bg.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth,LOCALBOARDPOSITION.DrawSize.TopHeight);
    bg.width = LOCALBOARDPOSITION.DrawSize.unitSize * 9;
    bg.height = LOCALBOARDPOSITION.DrawSize.unitSize * 16;

    start.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth+(BOARDSCALE.CENTER.x*LOCALBOARDPOSITION.DrawSize.unitSize),LOCALBOARDPOSITION.DrawSize.TopHeight+(BOARDSCALE.CENTER.y*LOCALBOARDPOSITION.DrawSize.unitSize));
    start.anchor.set(0.5,0.5);
    start.width = LOCALBOARDPOSITION.DrawSize.unitSize * 5.625;
    start.height = LOCALBOARDPOSITION.DrawSize.unitSize * 0.866;

    document.body.appendChild(TITLE.view);
    
    TITLE.stage.addChild(bg);
    TITLE.stage.addChild(logo);
    TITLE.stage.addChild(start);

    
    SOUNDS.bgm.play();
}

function main(){
    const bg = new PIXI.Sprite(SHEET.textures["title_back.png"]);
    bg.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth,LOCALBOARDPOSITION.DrawSize.TopHeight);
    bg.width = LOCALBOARDPOSITION.DrawSize.unitSize * 9;
    bg.height = LOCALBOARDPOSITION.DrawSize.unitSize * 16;
    MAIN.stage.addChild(bg);

    STAR = new PIXI.Graphics();

    STAR.lineStyle(0);
    STAR.beginFill(0xEDEAEC,1);
    STAR.drawStar(LOCALBOARDPOSITION.BoardCenter.x,LOCALBOARDPOSITION.BoardCenter.y,5,LOCALBOARDPOSITION.DrawSize.unitSize*(BOARDSCALE.InnerCircleRadius-BOARDSCALE.OrbPositionCircleRadius));
    STAR.interactive = true;
    STAR.on("pointerdown",()=>{
        BOARDINFO.connectMode = true;
        STAR.clear();
        STAR.lineStyle(0);
        STAR.beginFill(0xFFDF00,1);
        STAR.drawStar(LOCALBOARDPOSITION.BoardCenter.x,LOCALBOARDPOSITION.BoardCenter.y,5,LOCALBOARDPOSITION.DrawSize.unitSize*(BOARDSCALE.InnerCircleRadius-BOARDSCALE.OrbPositionCircleRadius));
    });

    STAR.endFill();
    MAIN.stage.addChild(STAR);

    let _arr = util_3x5Array.map((arr)=>arr.slice());
    let _color = _arr.map((v)=>{
        const tmpArr = v.map((v2)=>{
            return ORBCOLORS[Math.floor(Math.random()*ORBCOLORS.length)];
        })
        return tmpArr;
    })

    SPRITES = _color.map((v,i,a)=>{
        const tmpArr = v.map((v2,i2,a2)=>{
            const sprite = new PIXI.Sprite(SHEET.textures[v2]);
            return sprite;
        })
        return tmpArr;
    })

    SPRITES.forEach((v,i,a)=>{
        v.forEach((v2,i2,a2)=>{
            v2.interactive = true;
            v2.on("pointerdown",(()=>{
                if(BOARDINFO.connectMode === false){
                    BOARDINFO.changeQueue.push(i2);
                }
                    
            }));
            v2.position.set(ORBPOSITIONS[i][i2].x,ORBPOSITIONS[i][i2].y);
            v2.anchor.set(0.5,0.5);
            v2.width = LOCALBOARDPOSITION.DrawSize.unitSize * BOARDSCALE.OrbRadius;
            v2.height = LOCALBOARDPOSITION.DrawSize.unitSize * BOARDSCALE.OrbRadius;
            MAIN.stage.addChild(v2);
        })
    })

    BOARDINFO.message.texture = new PIXI.Text(BOARDINFO.message.text);
    MAIN.stage.addChild(BOARDINFO.message.texture);

    BOARDINFO.SCORE.texture = new PIXI.Text(BOARDINFO.SCORE.text);
    MAIN.stage.addChild(BOARDINFO.SCORE.texture);

    BOARDINFO.TIME.texture = new PIXI.Text(BOARDINFO.TIME.time);
    MAIN.stage.addChild(BOARDINFO.TIME.texture);

    document.body.appendChild(MAIN.view);
}


function result(){
    
    const bg = new PIXI.Sprite(SHEET.textures["title_back.png"]);
    const result = new PIXI.Sprite(SHEET.textures["result.png"]);
    const BTT = new PIXI.Sprite(SHEET.textures["back_to_title.png"]);

    BTT.interactive = true;
    BTT.on('pointerdown',()=>{
        RESULT.renderer.view.hidden = true;
        TITLE.renderer.view.hidden = false;
        BOARDINFO.SCORE.score = 0;
        BOARDINFO.TIME.time = 40;
        BOARDINFO.COUNTER = {
            "single":0,
            "double":0,
            "o3":0,
            "o4":0,
            "star":0,
            "o23":0
        }
    })


    bg.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth,LOCALBOARDPOSITION.DrawSize.TopHeight);
    bg.width = LOCALBOARDPOSITION.DrawSize.unitSize * 9;
    bg.height = LOCALBOARDPOSITION.DrawSize.unitSize * 16;

    result.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth+(LOCALBOARDPOSITION.DrawSize.unitSize * 4.5),LOCALBOARDPOSITION.DrawSize.TopHeight+(LOCALBOARDPOSITION.DrawSize.unitSize));
    result.width = LOCALBOARDPOSITION.DrawSize.unitSize * 4;
    result.height = LOCALBOARDPOSITION.DrawSize.unitSize * 1;
    result.anchor.set(0.5,0.5);

    BTT.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth+(BOARDSCALE.CENTER.x*LOCALBOARDPOSITION.DrawSize.unitSize),LOCALBOARDPOSITION.DrawSize.TopHeight+((BOARDSCALE.CENTER.y+2)*LOCALBOARDPOSITION.DrawSize.unitSize));
    BTT.anchor.set(0.5,0.5);
    BTT.width = LOCALBOARDPOSITION.DrawSize.unitSize * 4.5;
    BTT.height = LOCALBOARDPOSITION.DrawSize.unitSize * 2.1;

    RESULT.stage.addChild(bg);
    RESULT.stage.addChild(result);
    RESULT.stage.addChild(BTT);

    BOARDINFO.SCORE.style = new PIXI.TextStyle(BOARDINFO.SCORE.text_style);
    BOARDINFO.SCORE.texture = new PIXI.Text(BOARDINFO.SCORE.text,BOARDINFO.SCORE.style);
    BOARDINFO.SCORE.texture.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth+(BOARDSCALE.TextPosition.x*LOCALBOARDPOSITION.DrawSize.unitSize),LOCALBOARDPOSITION.DrawSize.TopHeight+(BOARDSCALE.TextPosition.y*LOCALBOARDPOSITION.DrawSize.unitSize));
    BOARDINFO.SCORE.texture.anchor.set(0.5,0.5);
    RESULT.stage.addChild(BOARDINFO.SCORE.texture);

    document.body.appendChild(RESULT.view);
}
