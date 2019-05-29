//アップデート設定
function setUpdate() {
    MAIN.ticker.add((delta) => {

        //オーブの回転が許可されているときに回転をする。
        if (BOARDINFO.canOrbRotate) {
            //オーブのエフェクト処理と回転処理を行う。時間更新量を入れる。
            ChangeSys(delta);
        }

        //星が繋がれた時
        if (BOARDINFO.connectMode) {
            ConnectStar(delta);
        }
    })

    //文字の更新
    MAIN.ticker.add((delta) => {

        //文字更新の処理
        if (BOARDINFO.TIME.update) {
            BOARDINFO.TIME.time -= delta * PIXI.Ticker.shared.deltaMS * 0.001;
            __systemTimer.count += delta
            if (__systemTimer.count > 4) {
                __systemTimer.count = 0;
                __systemTimer.update = true;
            }
        }

        //時間切れでタイムオーバー
        if (BOARDINFO.TIME.time < 0) {
            BOARDINFO.TIME.update = false;
            BOARDINFO.message.text = ""
            BOARDINFO.message.update = true;
            BOARDINFO.TIME.time = 30;
            BOARDINFO.TIME.point = 0;
            BOARDINFO.SCORE.update = true;
            MAIN.renderer.view.hidden = true;
            RESULT.renderer.view.hidden = false;
        } else {
            if (__systemTimer.update) {
                MAIN.stage.removeChild(BOARDINFO.TIME.texture);
                BOARDINFO.TIME.texture.destroy();
                BOARDINFO.TIME.texture = new PIXI.Text("TIME: " + BOARDINFO.TIME.time.toFixed(2) + "\n" + "SCORE: " + BOARDINFO.SCORE.score, new PIXI.TextStyle(BOARDINFO.TIME.style));
                BOARDINFO.TIME.texture.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth, LOCALBOARDPOSITION.DrawSize.TopHeight + LOCALBOARDPOSITION.DrawSize.unitSize * 1);
                BOARDINFO.TIME.texture.width = LOCALBOARDPOSITION.DrawSize.unitSize * 2;
                BOARDINFO.TIME.texture.height = LOCALBOARDPOSITION.DrawSize.unitSize * 3;
                MAIN.stage.addChild(BOARDINFO.TIME.texture);
                __systemTimer.update = false;
            }
        }

        //役の情報表示
        if (BOARDINFO.message.update) {
            MAIN.stage.removeChild(BOARDINFO.message.texture);
            BOARDINFO.message.texture.destroy();
            BOARDINFO.message.style = new PIXI.TextStyle(BOARDINFO.message.text_style);
            BOARDINFO.message.texture = new PIXI.Text(BOARDINFO.message.text, BOARDINFO.message.style);
            BOARDINFO.message.texture.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth + (BOARDSCALE.TextPosition.x * LOCALBOARDPOSITION.DrawSize.unitSize), LOCALBOARDPOSITION.DrawSize.TopHeight + (BOARDSCALE.TextPosition.y * LOCALBOARDPOSITION.DrawSize.unitSize));
            BOARDINFO.message.texture.anchor.set(0.5, 0.5);
            BOARDINFO.message.texture.width = LOCALBOARDPOSITION.DrawSize.unitSize * 4.854;
            BOARDINFO.message.texture.height = LOCALBOARDPOSITION.DrawSize.unitSize * 3;
            MAIN.stage.addChild(BOARDINFO.message.texture);
            BOARDINFO.message.update = false;
        }
    })

    RESULT.ticker.add((delta) => {
        if (BOARDINFO.SCORE.update) {
            RESULT.stage.removeChild(BOARDINFO.SCORE.texture);
            BOARDINFO.SCORE.texture.destroy();
            let text = "";
            text += "SCORE:" + BOARDINFO.SCORE.score;
            text += "\n\n";
            text += "1等星:" + BOARDINFO.COUNTER.star + "\n";
            text += "2等星:" + BOARDINFO.COUNTER.o4 + "\n";
            text += "3等星:" + BOARDINFO.COUNTER.o23 + "\n"
            text += "4等星:" + BOARDINFO.COUNTER.o3 + "\n";
            text += "5等星:" + BOARDINFO.COUNTER.double + "\n";
            text += "6等星:" + BOARDINFO.COUNTER.single + "\n";
            BOARDINFO.SCORE.style = new PIXI.TextStyle(BOARDINFO.SCORE.text_style);
            BOARDINFO.SCORE.texture = new PIXI.Text(text, BOARDINFO.SCORE.style);
            BOARDINFO.SCORE.texture.position.set(LOCALBOARDPOSITION.DrawSize.TopWidth + (BOARDSCALE.TextPosition.x * LOCALBOARDPOSITION.DrawSize.unitSize), LOCALBOARDPOSITION.DrawSize.TopHeight + ((BOARDSCALE.TextPosition.y) * LOCALBOARDPOSITION.DrawSize.unitSize));
            BOARDINFO.SCORE.texture.width = LOCALBOARDPOSITION.DrawSize.unitSize * 6;
            BOARDINFO.SCORE.texture.height = LOCALBOARDPOSITION.DrawSize.unitSize * 9;
            BOARDINFO.SCORE.texture.anchor.set(0.5, 0);
            RESULT.stage.addChild(BOARDINFO.SCORE.texture);
            BOARDINFO.SCORE.update = false;
        }

    })
}

function MainTextUpdater(text) {
    BOARDINFO.message.text = text;
    BOARDINFO.message.update = true;
}