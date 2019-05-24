function ChangeSys(deltaTime) {
    //エイリアス
    let oc = _sysOrbChange.changed;

    //オーブ交換のキューが入っていれば処理をする
    if(BOARDINFO.changeQueue.length > 0){
        
        if(oc.ready){
            SOUNDS.change.play();

            //回転する頂点を取得する
            _sysOrbChange.changeValue = BOARDINFO.changeQueue[0];

            //初期位置ラジアンを回転位置保持用変数にコピーする （任意の頂点の）[左周り外側１,左回り外側2,内側]
            _sysOrbChange._tmp_rotate_rad = OUTERPOSITIONCICLE_RAD[_sysOrbChange.changeValue];

            oc.ready = false;
            oc.effect = true;
        }

        //スプライト配列内の構造を変えないポジションの移動
        if(oc.effect){
            if(oc.effectDone === false){
                MoveOrb(deltaTime,_sysOrbChange.changeValue);
            }else if(oc.effectDone === true){
                oc.effect = false;
                oc.change = true;
                oc.effectDone = false;
            }
        }

        //スプライト配列内の構造を変えるポジションの移動
        if(oc.change){
            const vertex = _sysOrbChange.changeValue;
            const op = ORB_INITIALPOSITIONS;
            
            [SPRITES[0][vertex],SPRITES[1][vertex],SPRITES[2][vertex]] = [SPRITES[2][vertex],SPRITES[0][vertex],SPRITES[1][vertex]];
            
            SPRITES.forEach((v,i,a)=>{
                v.forEach((v2,i2,a2)=>{
                    v2.position.set(op[i][i2].x,op[i][i2].y);
                })
            })

            //キューから最初の要素を取り出して終了
            BOARDINFO.changeQueue.shift();
            oc.change = false;
            oc.ready = true;
        }
    }
}

//オーブを動かす処理
//deltaTime 変化量
//vartex 動かす頂点
function MoveOrb(deltaTime,vartex) {
    let oc = _sysOrbChange.changed;
    if(oc.effectDone === false){

        //度数法で120°分回転内であらば
        //_sysOrbChange.DEGREE120toRAD(2.0943951023931953)
        if(_sysOrbChange.DEGREE120toRAD > _sysOrbChange.radTotal){
            const _quantity = deltaTime*_sysOrbChange.addRadStep;
            _sysOrbChange.radTotal += _quantity;

            const tmpArr = _sysOrbChange._tmp_rotate_rad;

            //回転方向は左回りのため変化量をマイナスにする
            _sysOrbChange._tmp_rotate_rad = tmpArr.map((v,i,a)=>{
                return v - _quantity;
            });

            //エイリアス
            const LI = LOCALBOARDPOSITION.InnerCircleCenterPosition;
            const BO = BOARDSCALE.OrbPositionCircleRadius;
            const US = LOCALBOARDPOSITION.DrawSize.unitSize;
            const cos = Math.cos;
            const sin = Math.sin;
            const _rad = _sysOrbChange._tmp_rotate_rad;

            SPRITES[0][vartex].position.set(LI[vartex].x+cos(_rad[2])*US*BO,LI[vartex].y+sin(_rad[2])*US*BO*-1);
            SPRITES[1][vartex].position.set(LI[vartex].x+cos(_rad[0])*US*BO,LI[vartex].y+sin(_rad[0])*US*BO*-1);
            SPRITES[2][vartex].position.set(LI[vartex].x+cos(_rad[1])*US*BO,LI[vartex].y+sin(_rad[1])*US*BO*-1);

        //度数法120°分回転したらリセット。次の処理へ。
        }else{
            _sysOrbChange._tmp_rotate_rad = null;
            _sysOrbChange.radTotal = 0;
            oc.effectDone = true;
        }
    }
}