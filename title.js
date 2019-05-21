function title(){
    
    const sprite = new PIXI.Sprite(SHEET.textures["title.png"]);

    sprite.interactive = true;
    sprite.on('pointerdown',()=>{
        TITLE.renderer.view.hidden = true;
        MAIN.renderer.view.hidden = false;
    })

    document.body.appendChild(TITLE.view);
    TITLE.stage.addChild(sprite);
}

function main(){

    __result = new PIXI.Sprite(SHEET.textures["result.png"])

    __result.interactive = true;
    __result.on('pointerdown',()=>{
        MAIN.renderer.view.hidden = true;
        RESULT.renderer.view.hidden = false;
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

    
    

    BOARDINFO.message.texture = new PIXI.Text(BOARDINFO.message.text);
    MAIN.stage.addChild(BOARDINFO.message.texture);

    document.body.appendChild(MAIN.view);
}


function result(){
    const sprite = new PIXI.Sprite(SHEET.textures["back_to_title.png"]);

    sprite.interactive = true;
    sprite.on('pointerdown',()=>{
        RESULT.renderer.view.hidden = true;
        TITLE.renderer.view.hidden = false;
    })

    
    document.body.appendChild(RESULT.view);
    RESULT.stage.addChild(sprite);
}
