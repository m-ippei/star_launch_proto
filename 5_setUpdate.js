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

            //色の文字列だけにする。
            const _disable_arr = _lists_arr.map((v,i,a)=>{
                return v[0];
            })

            SPRITES[0].forEach((v,i,a)=>{
                _disable_arr.forEach((v2,i2,a2)=>{
                    if(v._texture.textureCacheIds[0] === v2){
                        v.visible = false;
                    }
                })
            })

            BOARDINFO.message.update = true;
            BOARDINFO.message.text = "CLEAR!"

            BOARDINFO.connectMode = false;


        }
    })

    /*

    APP.ticker.add((delta)=>{
        if(BOARDINFO.message.update){
            APP.stage.removeChild(BOARDINFO.texture);
            BOARDINFO.message.style = new PIXI.TextStyle(BOARDINFO.message.text_style);
            BOARDINFO.texture = new PIXI.Text(BOARDINFO.message.text,BOARDINFO.message.style);
            BOARDINFO.texture.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth+(BOARDSCALE.TextPosition.x*LOCALBOARDPOSITION.DrawSize.unitSize),LOCALBOARDPOSITION.DrawSize.TopHeight+(BOARDSCALE.TextPosition.y*LOCALBOARDPOSITION.DrawSize.unitSize));
            BOARDINFO.texture.anchor.set(0.5,0.5);
            BOARDINFO.texture.width = BOARDSCALE.TextPosition.width * LOCALBOARDPOSITION.DrawSize.unitSize;
            BOARDINFO.texture.height = BOARDSCALE.TextPosition.height * LOCALBOARDPOSITION.DrawSize.unitSize;
            APP.stage.addChild(BOARDINFO.texture);
            BOARDINFO.message.update = false;
        }
    })
    */
}