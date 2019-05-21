function title(){
    
    const bg = new PIXI.Sprite(SHEET.textures["title_back.png"]);
    const logo = new PIXI.Sprite(SHEET.textures["title.png"]);
    const start = new PIXI.Sprite(SHEET.textures["tap_start.png"]);
    
    logo.interactive = true;
    logo.on('pointerdown',()=>{
        TITLE.renderer.view.hidden = true;
        MAIN.renderer.view.hidden = false;
    })

    bg.interactive = true;
    bg.on('pointerdown',()=>{
        TITLE.renderer.view.hidden = true;
        MAIN.renderer.view.hidden = false;
    })

    start.interactive = true;
    start.on('pointerdown',()=>{
        TITLE.renderer.view.hidden = true;
        MAIN.renderer.view.hidden = false;
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
}

function main(){
    const bg = new PIXI.Sprite(SHEET.textures["title_back.png"]);
    bg.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth,LOCALBOARDPOSITION.DrawSize.TopHeight);
    bg.width = LOCALBOARDPOSITION.DrawSize.unitSize * 9;
    bg.height = LOCALBOARDPOSITION.DrawSize.unitSize * 16;
    MAIN.stage.addChild(bg);

    /*
    const board = new PIXI.Sprite(SHEET.textures["board.png"]);
    board.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth,LOCALBOARDPOSITION.DrawSize.TopHeight+(LOCALBOARDPOSITION.DrawSize.unitSize*7));
    board.width = LOCALBOARDPOSITION.DrawSize.unitSize * 9;
    board.height = LOCALBOARDPOSITION.DrawSize.unitSize * 9;
    MAIN.stage.addChild(board);
    */
    
    __result = new PIXI.Sprite(SHEET.textures["result.png"])

    __result.interactive = true;
    __result.on('pointerdown',()=>{
        MAIN.renderer.view.hidden = true;
        RESULT.renderer.view.hidden = false;
        //BOARDINFO.SCORE.text = BOARDINFO.SCORE.score;
        //BOARDINFO.message.update = true;
    })

    document.body.appendChild(MAIN.view);
    MAIN.stage.addChild(__result);

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

        //MAIN.renderer.view.hidden = true;
        //RESULT.renderer.view.hidden = false;
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
                    SOUNDS.change.stop();
                    SOUNDS.change.play();
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

    
    

    BOARDINFO.SCORE.texture = new PIXI.Text(BOARDINFO.SCORE.text);
    MAIN.stage.addChild(BOARDINFO.SCORE.texture);

    document.body.appendChild(MAIN.view);
}


function result(){
    /*
    const sprite = new PIXI.Sprite(SHEET.textures["back_to_title.png"]);

    sprite.interactive = true;
    sprite.on('pointerdown',()=>{
        RESULT.renderer.view.hidden = true;
        TITLE.renderer.view.hidden = false;
    })

    
    document.body.appendChild(RESULT.view);
    RESULT.stage.addChild(sprite);
    */
    const bg = new PIXI.Sprite(SHEET.textures["title_back.png"]);
    const result = new PIXI.Sprite(SHEET.textures["result.png"]);
    const BTT = new PIXI.Sprite(SHEET.textures["back_to_title.png"]);

    BTT.interactive = true;
    BTT.on('pointerdown',()=>{
        RESULT.renderer.view.hidden = true;
        TITLE.renderer.view.hidden = false;
        BOARDINFO.SCORE.score = 0;
    })


    bg.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth,LOCALBOARDPOSITION.DrawSize.TopHeight);
    bg.width = LOCALBOARDPOSITION.DrawSize.unitSize * 9;
    bg.height = LOCALBOARDPOSITION.DrawSize.unitSize * 16;

    result.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth+(LOCALBOARDPOSITION.DrawSize.unitSize * 4.5),LOCALBOARDPOSITION.DrawSize.TopHeight+(LOCALBOARDPOSITION.DrawSize.unitSize*1));
    result.anchor.set(0.5,0.5);
    //BTT.width = LOCALBOARDPOSITION.DrawSize.unitSize * 2.72;
    //BTT.height = LOCALBOARDPOSITION.DrawSize.unitSize * 0.901;

    BTT.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth+(BOARDSCALE.CENTER.x*LOCALBOARDPOSITION.DrawSize.unitSize),LOCALBOARDPOSITION.DrawSize.TopHeight+(BOARDSCALE.CENTER.y*LOCALBOARDPOSITION.DrawSize.unitSize));
    BTT.anchor.set(0.5,0.5);
    BTT.width = LOCALBOARDPOSITION.DrawSize.unitSize * 4.5;
    BTT.height = LOCALBOARDPOSITION.DrawSize.unitSize * 2.1;

    
    

    RESULT.stage.addChild(bg);
    RESULT.stage.addChild(result);
    RESULT.stage.addChild(BTT);

    //BOARDINFO.message.text = SCORE;

    //BOARDINFO.message.texture = new PIXI.Text(BOARDINFO.message.text);
    //BOARDINFO.message.texture = new PIXI.Text("");
    BOARDINFO.SCORE.style = new PIXI.TextStyle(BOARDINFO.SCORE.text_style);
    BOARDINFO.SCORE.texture = new PIXI.Text(BOARDINFO.SCORE.text,BOARDINFO.SCORE.style);
    BOARDINFO.SCORE.texture.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth+(BOARDSCALE.TextPosition.x*LOCALBOARDPOSITION.DrawSize.unitSize),LOCALBOARDPOSITION.DrawSize.TopHeight+(BOARDSCALE.TextPosition.y*LOCALBOARDPOSITION.DrawSize.unitSize));
    BOARDINFO.SCORE.texture.anchor.set(0.5,0.5);
    //BOARDINFO.message.texture.anchor.set(1,1);
    //BOARDINFO.texture.width = BOARDSCALE.TextPosition.width * LOCALBOARDPOSITION.DrawSize.unitSize;
    //BOARDINFO.texture.height = BOARDSCALE.TextPosition.height * LOCALBOARDPOSITION.DrawSize.unitSize;
    //RESULT.stage.addChild(BOARDINFO.message.texture);
    RESULT.stage.addChild(BOARDINFO.SCORE.texture);

    document.body.appendChild(RESULT.view);
}
