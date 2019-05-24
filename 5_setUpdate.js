//アップデート設定
function setUpdate() {
    MAIN.ticker.add((delta)=>{

        /*
        //オーブの位置スワップ
        if(BOARDINFO.changeQueue.length > 0){
            SOUNDS.change.play();
            
            const vertex = BOARDINFO.changeQueue.shift();
            const op = ORB_INITIALPOSITIONS;

            [SPRITES[0][vertex],SPRITES[1][vertex],SPRITES[2][vertex]] = [SPRITES[2][vertex],SPRITES[0][vertex],SPRITES[1][vertex]];

            SPRITES.forEach((v,i,a)=>{
                v.forEach((v2,i2,a2)=>{
                    v2.position.set(op[i][i2].x,op[i][i2].y);
                })
            })
        }
        */

        //オーブのエフェクト処理と回転処理を行う。時間更新量を入れる。
        ChangeSys(delta);

        //星が繋がれた時
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

            //一個も揃わなければゲームオーバー
            if(_lists_arr.length === 0){
                BOARDINFO.message.text = ""
                BOARDINFO.message.update = true;
                MAIN.renderer.view.hidden = true;
                RESULT.renderer.view.hidden = false;
                BOARDINFO.SCORE.update = true;
                
                BOARDINFO.TIME.update = false;
                BOARDINFO.TIME.point = 0;
                BOARDINFO.TIME.time = 0;

            
            //得点計算
            }else if(_lists_arr.length === 1){
                if(_lists_arr[0][1] === 2){
                    SOUNDS.single.play();
                    BOARDINFO.TIME.point = 100
                    BOARDINFO.SCORE.score += BOARDINFO.TIME.point;
                    MainTextUpdater("Single\n100");
                    BOARDINFO.COUNTER.single += 1;
                }else if(_lists_arr[0][1] === 3){
                    SOUNDS.o3.play();
                    BOARDINFO.TIME.point = 400
                    BOARDINFO.SCORE.score += BOARDINFO.TIME.point
                    MainTextUpdater("3 Orbs\n400");
                    BOARDINFO.COUNTER.o3 += 1;
                }else if(_lists_arr[0][1] === 4){
                    SOUNDS.o4.play();
                    MainTextUpdater("4 Orbs\n600");
                    BOARDINFO.TIME.point = 600
                    BOARDINFO.SCORE.score += BOARDINFO.TIME.point;
                    BOARDINFO.COUNTER.o4 += 1;
                }else if(_lists_arr[0][1] === 5){
                    SOUNDS.star.play();
                    BOARDINFO.TIME.point = 800
                    BOARDINFO.SCORE.score += BOARDINFO.TIME.point;
                    MainTextUpdater("Star!\n800");
                    BOARDINFO.COUNTER.star +=1;
                }
            }else if(_lists_arr.length === 2){
                if(_lists_arr[0][1] === 3 || _lists_arr[1][1] === 3){
                    SOUNDS.mixstar.play();
                    BOARDINFO.TIME.point = 500
                    BOARDINFO.SCORE.score += BOARDINFO.TIME.point
                    MainTextUpdater("MixStar\n500");
                    BOARDINFO.COUNTER.o23 += 1;
                }else{
                    SOUNDS.double.play();
                    BOARDINFO.TIME.point = 300
                    BOARDINFO.SCORE.score += BOARDINFO.TIME.point
                    MainTextUpdater("Double\n300");
                    BOARDINFO.COUNTER.double += 1;
                }
            }

            //色の文字列だけにする。
            const _disable_arr = _lists_arr.map((v,i,a)=>{
                return v[0];
            })

            //消すドロップが無ければ星の色をグレーに
            if(_disable_arr.length > 0){
                
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

            //更新完了
            BOARDINFO.connectMode = false;
        }
    })

    //文字の更新
    MAIN.ticker.add((delta)=>{

        //文字更新の処理
        if(BOARDINFO.TIME.update){
            BOARDINFO.TIME.time -= delta*PIXI.Ticker.shared.deltaMS*0.001;
            __systemTimer.count += delta
            if(__systemTimer.count > 4){
                __systemTimer.count = 0;
                __systemTimer.update = true;
            }
        }
        
        //時間切れでタイムオーバー
        if(BOARDINFO.TIME.time < 0){
            BOARDINFO.TIME.update = false;
            BOARDINFO.message.text = ""
            BOARDINFO.message.update = true;
            BOARDINFO.TIME.time = 30;
            BOARDINFO.TIME.point = 0;
            BOARDINFO.SCORE.update = true;
            MAIN.renderer.view.hidden = true;
            RESULT.renderer.view.hidden = false;
        }else{
            if(__systemTimer.update){
                MAIN.stage.removeChild(BOARDINFO.TIME.texture);
                BOARDINFO.TIME.texture.destroy();
                BOARDINFO.TIME.texture = new PIXI.Text("TIME: "+ BOARDINFO.TIME.time.toFixed(2)+"\n"+"SCORE: "+BOARDINFO.SCORE.score,new PIXI.TextStyle(BOARDINFO.TIME.style));
                BOARDINFO.TIME.texture.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth,LOCALBOARDPOSITION.DrawSize.TopHeight+LOCALBOARDPOSITION.DrawSize.unitSize*1);
                BOARDINFO.TIME.texture.width = LOCALBOARDPOSITION.DrawSize.unitSize * 2;
                BOARDINFO.TIME.texture.height = LOCALBOARDPOSITION.DrawSize.unitSize * 3;
                MAIN.stage.addChild(BOARDINFO.TIME.texture);
                __systemTimer.update = false;
            }
        }

        //役の情報表示
        if(BOARDINFO.message.update){
            MAIN.stage.removeChild(BOARDINFO.message.texture);
            BOARDINFO.message.texture.destroy();
            BOARDINFO.message.style = new PIXI.TextStyle(BOARDINFO.message.text_style);
            BOARDINFO.message.texture = new PIXI.Text(BOARDINFO.message.text,BOARDINFO.message.style);
            BOARDINFO.message.texture.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth+(BOARDSCALE.TextPosition.x*LOCALBOARDPOSITION.DrawSize.unitSize),LOCALBOARDPOSITION.DrawSize.TopHeight+(BOARDSCALE.TextPosition.y*LOCALBOARDPOSITION.DrawSize.unitSize));
            BOARDINFO.message.texture.anchor.set(0.5,0.5);
            BOARDINFO.message.texture.width = LOCALBOARDPOSITION.DrawSize.unitSize * 4.854;
            BOARDINFO.message.texture.height = LOCALBOARDPOSITION.DrawSize.unitSize * 3;
            MAIN.stage.addChild(BOARDINFO.message.texture);
            BOARDINFO.message.update = false;
        }
    })
}

function MainTextUpdater(text){
    BOARDINFO.message.text = text;
    BOARDINFO.message.update = true;
}