//描画設定

/*
function setDraw() {
    BOARDINFO.message.style = new PIXI.TextStyle(BOARDINFO.message.text_style);
    BOARDINFO.texture = new PIXI.Text(BOARDINFO.message.text,BOARDINFO.message.style);
    BOARDINFO.texture.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth+(BOARDSCALE.TextPosition.x*LOCALBOARDPOSITION.DrawSize.unitSize),LOCALBOARDPOSITION.DrawSize.TopHeight+(BOARDSCALE.TextPosition.y*LOCALBOARDPOSITION.DrawSize.unitSize));
    BOARDINFO.texture.anchor.set(0.5,0.5);
    BOARDINFO.texture.width = BOARDSCALE.TextPosition.width * LOCALBOARDPOSITION.DrawSize.unitSize;
    BOARDINFO.texture.height = BOARDSCALE.TextPosition.height * LOCALBOARDPOSITION.DrawSize.unitSize;
    APP.stage.addChild(BOARDINFO.texture);

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

    APP.stage.addChild(STAR);

    //オーブの描画
    PIXI.Loader.shared.add("images/sprites.json").load((loder, resources) => {
        
        const sheet = resources["images/sprites.json"].spritesheet;
       
        let _arr = util_3x5Array.map((arr)=>arr.slice());
        let _color = _arr.map((v)=>{
            const tmpArr = v.map((v2)=>{
                return ORBCOLORS[Math.floor(Math.random()*ORBCOLORS.length)];
            })
            return tmpArr;
        })

        SPRITES = _color.map((v,i,a)=>{
            const tmpArr = v.map((v2,i2,a2)=>{
                const sprite = new PIXI.Sprite(sheet.textures[v2]);
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
                APP.stage.addChild(v2);
            })
        })
    }
    );
}
*/