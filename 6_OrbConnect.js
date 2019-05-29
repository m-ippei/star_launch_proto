function ConnectStar(deltaTime) {

    //星の頂点情報の更新があれば更新(星が押されたらupdateがtrue)
    if (_sysTimeConnectInfo.update) {
        //オーブの回転禁止
        BOARDINFO.canOrbRotate = false;
        //星の情報収集
        STAR.visible = false;
        [_sysTimeConnectInfo.Colors, _sysTimeConnectInfo.Disables] = CorrectOrbInfo();
        _sysTimeConnectInfo.update = false
    }

    if (BOARDINFO.LaunchEffectDone) {
        //画面処理
        ScreenUpdate(_sysTimeConnectInfo.Disables);
        //得点処理
        Scoring(_sysTimeConnectInfo.Colors);
        //更新完了
        BOARDINFO.connectMode = false;
        BOARDINFO.canOrbRotate = true;
        _sysTimeConnectInfo.update = false;
        //エフェクト処理状況の初期化
        BOARDINFO.LaunchEffcetDone = false;
        STAR.visible = true;
    } else {
        //エフェクト処理
        LaunchEffect(_sysTimeConnectInfo.Disables, deltaTime);
    }

}

function CorrectOrbInfo() {
    //星の頂点の色情報のみ保存する
    const _arr = SPRITES[0].map((v, i, a) => {
        return v._texture.textureCacheIds[0];
    });


    //星の頂点をオブジェクト形式で保存する
    const _lists = {};
    _arr.forEach((v, i, a) => {
        if (_lists.hasOwnProperty(v)) {
            _lists[v] += 1
        } else {
            _lists[v] = 1;
        }
    })


    //オブジェクト形式にしたものを配列にする
    let formatted_OrbColorLists = Object.entries(_lists);

    //同じ色が２つ以上あるものだけ残す。
    formatted_OrbColorLists = formatted_OrbColorLists.filter((v, i, a) => {
        return v[1] > 1;
    })

    //色の文字列だけにする。
    const disableOrbcolorArrs = formatted_OrbColorLists.map((v, i, a) => {
        return v[0];
    })

    return [formatted_OrbColorLists, disableOrbcolorArrs];
}

function LaunchEffect(Colorlist, deltaTime) {
    if (_sysLaunchEffect.LimitTime > _sysLaunchEffect.TotalTime) {
        _sysLaunchEffect.TotalTime += deltaTime * _sysLaunchEffect.TimeStep;
        SPRITES[0].forEach((v, i, a) => {
            Colorlist.forEach((v2, i2, a2) => {
                if (v._texture.textureCacheIds[0] === v2) {
                    //v.visible = false;
                    //BOARDINFO.changeQueue.push(i);
                    v.position.set(LOCALBOARDPOSITION.BoardCenter.x, LOCALBOARDPOSITION.BoardCenter.y);
                }
            })
        })
    } else {
        SPRITES[0].forEach((v, i, a) => {
            Colorlist.forEach((v2, i2, a2) => {
                if (v._texture.textureCacheIds[0] === v2) {
                    v.visible = false;
                    //BOARDINFO.changeQueue.push(i);
                }
            })
        })
        _sysLaunchEffect.TotalTime = 0;
        BOARDINFO.LaunchEffectDone = true;
    }

}


//得点処理
function Scoring(ColorList) {
    //一個も揃わなければゲームオーバー
    if (ColorList.length === 0) {
        BOARDINFO.message.text = ""
        BOARDINFO.message.update = true;
        MAIN.renderer.view.hidden = true;
        RESULT.renderer.view.hidden = false;
        BOARDINFO.SCORE.update = true;

        BOARDINFO.TIME.update = false;
        BOARDINFO.TIME.point = 0;
        BOARDINFO.TIME.time = 0;


        //得点計算
    } else if (ColorList.length === 1) {
        if (ColorList[0][1] === 2) {
            SOUNDS.single.play();
            BOARDINFO.TIME.point = 100
            BOARDINFO.SCORE.score += BOARDINFO.TIME.point;
            MainTextUpdater("Single\n100");
            BOARDINFO.COUNTER.single += 1;
        } else if (ColorList[0][1] === 3) {
            SOUNDS.o3.play();
            BOARDINFO.TIME.point = 400
            BOARDINFO.SCORE.score += BOARDINFO.TIME.point
            MainTextUpdater("3 Orbs\n400");
            BOARDINFO.COUNTER.o3 += 1;
        } else if (ColorList[0][1] === 4) {
            SOUNDS.o4.play();
            MainTextUpdater("4 Orbs\n600");
            BOARDINFO.TIME.point = 600
            BOARDINFO.SCORE.score += BOARDINFO.TIME.point;
            BOARDINFO.COUNTER.o4 += 1;
        } else if (ColorList[0][1] === 5) {
            SOUNDS.star.play();
            BOARDINFO.TIME.point = 800
            BOARDINFO.SCORE.score += BOARDINFO.TIME.point;
            MainTextUpdater("Star!\n800");
            BOARDINFO.COUNTER.star += 1;
        }
    } else if (ColorList.length === 2) {
        if (ColorList[0][1] === 3 || ColorList[1][1] === 3) {
            SOUNDS.mixstar.play();
            BOARDINFO.TIME.point = 500
            BOARDINFO.SCORE.score += BOARDINFO.TIME.point
            MainTextUpdater("MixStar\n500");
            BOARDINFO.COUNTER.o23 += 1;
        } else {
            SOUNDS.double.play();
            BOARDINFO.TIME.point = 300
            BOARDINFO.SCORE.score += BOARDINFO.TIME.point
            MainTextUpdater("Double\n300");
            BOARDINFO.COUNTER.double += 1;
        }
    }
}

//画面処理
function ScreenUpdate(disableArr) {


    if (disableArr.length > 0) {

    } else {
        //消すドロップが無ければ星の色をグレーに
        STAR.clear();
        STAR.lineStyle(0);
        STAR.beginFill(0xEDEAEC, 1);
        STAR.drawStar(LOCALBOARDPOSITION.BoardCenter.x, LOCALBOARDPOSITION.BoardCenter.y, 5, LOCALBOARDPOSITION.DrawSize.unitSize * (BOARDSCALE.InnerCircleRadius - BOARDSCALE.OrbPositionCircleRadius));
    }

    /*

    //消す色と星の頂点のオーブが一致したら非表示
    SPRITES[0].forEach((v, i, a) => {
        disableArr.forEach((v2, i2, a2) => {
            if (v._texture.textureCacheIds[0] === v2) {
                v.visible = false;
                //BOARDINFO.changeQueue.push(i);
            }
        })
    })

    */


    //見えなくしたオーブを実際に消して空にする
    SPRITES[0].forEach((v, i, a) => {
        if (v.visible === false) {
            //console.log("a")
            a[i].destroy();
            a[i] = null;
        }
    })

    //空になったオーブに新しいオーブを作る
    SPRITES[0].forEach((v, i, a) => {
        if (v === null) {
            a[i] = new PIXI.Sprite(SHEET.textures[ORBCOLORS[Math.floor(Math.random() * ORBCOLORS.length)]]);
            a[i].interactive = true;
            a[i].on("pointerdown", (() => {
                if (BOARDINFO.connectMode === false) {
                    BOARDINFO.changeQueue.push(i);
                }
            }));
            a[i].position.set(ORB_INITIALPOSITIONS[0][i].x, ORB_INITIALPOSITIONS[0][i].y);
            a[i].anchor.set(0.5, 0.5);
            a[i].width = LOCALBOARDPOSITION.DrawSize.unitSize * BOARDSCALE.OrbRadius;
            a[i].height = LOCALBOARDPOSITION.DrawSize.unitSize * BOARDSCALE.OrbRadius;
            MAIN.stage.addChild(a[i]);
        }
    })

    //STAR.visible = true;
}