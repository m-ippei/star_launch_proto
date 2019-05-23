//アップデート設定
function setUpdate() {
    MAIN.ticker.add((delta)=>{
        if(BOARDINFO.changeQueue.length > 0){
            
            const vertex = BOARDINFO.changeQueue.shift();
            const op = ORB_INITIALPOSITIONS;

            [SPRITES[0][vertex],SPRITES[1][vertex],SPRITES[2][vertex]] = [SPRITES[2][vertex],SPRITES[0][vertex],SPRITES[1][vertex]];

            SPRITES.forEach((v,i,a)=>{
                v.forEach((v2,i2,a2)=>{
                    v2.position.set(op[i][i2].x,op[i][i2].y);
                })
            })
        }

        if(BOARDINFO.connectMode){
            
            //星の頂点の色情報のみ保存する
            const _arr = SPRITES[0].map((v,i,a)=>{
                return v._texture.textureCacheIds[0];
            });

            //星の頂点をオブジェクト形式で保存する
            const _lists = {};

            _arr.forEach((v,i,a)=>{
                if(_lists.hasOwnProperty(v)){
                    _lists[v] += 1
                }else{
                    _lists[v] = 1;
                }
            })

            //オブジェクト形式にしたものを配列にする
            let _lists_arr = Object.entries(_lists);

            //同じ色が２つ以上あるものだけ残す。
            _lists_arr = _lists_arr.filter((v,i,a)=>{
                return v[1] > 1;
            })

            

            if(_lists_arr.length === 0){
                CHAIN = 0;
                BOARDINFO.message.text = ""
                BOARDINFO.message.update = true;
                MAIN.renderer.view.hidden = true;
                RESULT.renderer.view.hidden = false;
                BOARDINFO.SCORE.update = true;

                TIME.point = 0
                TIME.time = 0;

                //console.log("No Pair")
            }else if(_lists_arr.length === 1){
                if(_lists_arr[0][1] === 2){
                    TIME.point = 100
                    BOARDINFO.SCORE.score += TIME.point;
                    MainTextUpdater("Single\n100");
                    COUNTER.single += 1;
                }else if(_lists_arr[0][1] === 3){
                    TIME.point = 400
                    BOARDINFO.SCORE.score += TIME.point
                    MainTextUpdater("3 Orbs\n400");
                    COUNTER.o3 += 1;
                }else if(_lists_arr[0][1] === 4){
                    MainTextUpdater("4 Orbs\n600");
                    TIME.point = 600
                    BOARDINFO.SCORE.score += TIME.point;
                    COUNTER.o4 += 1;
                }else if(_lists_arr[0][1] === 5){
                    TIME.point = 800
                    BOARDINFO.SCORE.score += TIME.point;
                    MainTextUpdater("Star!\n800");
                    COUNTER.star +=1;
                }
            }else if(_lists_arr.length === 2){
                if(_lists_arr[0][1] === 3 || _lists_arr[1][1] === 3){
                    TIME.point = 500
                    BOARDINFO.SCORE.score += TIME.point
                    MainTextUpdater("MixStar\n500");
                    COUNTER.o23 += 1;
                }else{
                    TIME.point = 300
                    BOARDINFO.SCORE.score += TIME.point
                    MainTextUpdater("Double\n300");
                    COUNTER.double += 1;
                }
            }

            //色の文字列だけにする。
            const _disable_arr = _lists_arr.map((v,i,a)=>{
                return v[0];
            })

            if(_disable_arr.length > 0){
                SOUNDS.star.play();
            }else{
                STAR.clear();
                STAR.lineStyle(0);
                STAR.beginFill(0xEDEAEC,1);
                STAR.drawStar(LOCALBOARDPOSITION.BoardCenter.x,LOCALBOARDPOSITION.BoardCenter.y,5,LOCALBOARDPOSITION.DrawSize.unitSize*(BOARDSCALE.InnerCircleRadius-BOARDSCALE.OrbPositionCircleRadius));
            }

            
            SPRITES[0].forEach((v,i,a)=>{
                _disable_arr.forEach((v2,i2,a2)=>{
                    if(v._texture.textureCacheIds[0] === v2){
                        v.visible = false;
                    }
                })
            })

            const tmpArr = SPRITES[0]

            tmpArr.forEach((v,i,a)=>{
                if(v.visible === false){
                    SPRITES[0][i].destroy();
                    SPRITES[0][i] = null;
                }
            })

            const tmpArr2 = SPRITES[0];

            

            tmpArr2.forEach((v,i,a)=>{
                if(v === null){
                    SPRITES[0][i] = new PIXI.Sprite(SHEET.textures[ORBCOLORS[Math.floor(Math.random()*ORBCOLORS.length)]]);
                    SPRITES[0][i].interactive = true;
                    SPRITES[0][i].on("pointerdown",(()=>{
                        if(BOARDINFO.connectMode === false){
                            BOARDINFO.changeQueue.push(i);
                        }
                     }));
                    SPRITES[0][i].position.set(ORB_INITIALPOSITIONS[0][i].x,ORB_INITIALPOSITIONS[0][i].y);
                    SPRITES[0][i].anchor.set(0.5,0.5);
                    SPRITES[0][i].width = LOCALBOARDPOSITION.DrawSize.unitSize * BOARDSCALE.OrbRadius;
                    SPRITES[0][i].height = LOCALBOARDPOSITION.DrawSize.unitSize * BOARDSCALE.OrbRadius;
                    MAIN.stage.addChild(SPRITES[0][i]);
                }
            })

            BOARDINFO.connectMode = false;


        }
    })

    

    MAIN.ticker.add((delta)=>{
        if(BOARDINFO.message.update){
            MAIN.stage.removeChild(BOARDINFO.message.texture);
            BOARDINFO.message.style = new PIXI.TextStyle(BOARDINFO.message.text_style);
            BOARDINFO.message.texture = new PIXI.Text(BOARDINFO.message.text,BOARDINFO.message.style);
            BOARDINFO.message.texture.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth+(BOARDSCALE.TextPosition.x*LOCALBOARDPOSITION.DrawSize.unitSize),LOCALBOARDPOSITION.DrawSize.TopHeight+(BOARDSCALE.TextPosition.y*LOCALBOARDPOSITION.DrawSize.unitSize));
            BOARDINFO.message.texture.anchor.set(0.5,0.5);
            MAIN.stage.addChild(BOARDINFO.message.texture);
            BOARDINFO.message.update = false;
        }

        if(TIME.update){
            TIME.time -= delta*0.01;
        }
        if(TIME.time < 0){
            TIME.update = false;
            TIME.time = 40;
            TIME.point = 0;
            MAIN.renderer.view.hidden = true;
            RESULT.renderer.view.hidden = false;
            BOARDINFO.SCORE.update = true;
        }else{
        MAIN.stage.removeChild(TIME.texture);
        //BOARDINFO.message.style = new PIXI.TextStyle(BOARDINFO.message.text_style);
        TIME.texture = new PIXI.Text("TIME: "+ TIME.time.toFixed(2)+"\n"+"SCORE: "+BOARDINFO.SCORE.score,new PIXI.TextStyle({
            fontFamily: "Kosugi Maru",
            fontSize: 40,
            fill:['#f4f2db','#ffffff'],
            wordWrap:true
            
        }));
        TIME.texture.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth,LOCALBOARDPOSITION.DrawSize.TopHeight);
        //BOARDINFO.message.texture.anchor.set(0.5,0.5);
        MAIN.stage.addChild(TIME.texture);
        }
        
    })

    RESULT.ticker.add((delta)=>{
        if(BOARDINFO.SCORE.update){
            let text = "";
            text += "SCORE:" + BOARDINFO.SCORE.score;
            text += "\n\n";
            text += "1等星:" + COUNTER.star + "\n";
            text += "2等星:" + COUNTER.o4 + "\n";
            text += "3等星:" + COUNTER.o23 + "\n"
            text += "4等星:" + COUNTER.o3 + "\n";
            text += "5等星:" + COUNTER.double + "\n";
            text += "6等星:" + COUNTER.single + "\n";
            RESULT.stage.removeChild(BOARDINFO.SCORE.texture);
            BOARDINFO.SCORE.style = new PIXI.TextStyle(BOARDINFO.SCORE.text_style);
            BOARDINFO.SCORE.texture = new PIXI.Text(text,BOARDINFO.SCORE.style);
            BOARDINFO.SCORE.texture.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth+(BOARDSCALE.TextPosition.x*LOCALBOARDPOSITION.DrawSize.unitSize),LOCALBOARDPOSITION.DrawSize.TopHeight+((BOARDSCALE.TextPosition.y-2)*LOCALBOARDPOSITION.DrawSize.unitSize));
            BOARDINFO.SCORE.texture.anchor.set(0.5,0);
            RESULT.stage.addChild(BOARDINFO.SCORE.texture);
            BOARDINFO.SCORE.update = false;
        }
        
    })
}

function MainTextUpdater(text){
    CHAIN += 1;
    BOARDINFO.message.text = text;
    BOARDINFO.message.update = true;
}