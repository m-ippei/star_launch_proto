//デバイス固有の座標群設定
function setLocalize() {

    //nullまたは0の2次配列で初期化
    SPRITES = util_3x5Array.map((arr)=>arr.slice().fill(null));
    ORBPOSITIONS = util_3x5Array.map((arr)=>arr.slice());

    const _ds = LOCALBOARDPOSITION.DrawSize;
    _ds.unitSize = setLocalSize_9x16(WIDTH,HEIGHT);
    const _arr = returnleftTopANDRightTop_9x16(WIDTH,HEIGHT,_ds.unitSize);
    _ds.TopWidth = _arr[0];
    _ds.TopHeight = _arr[1];

    const _bc = LOCALBOARDPOSITION.BoardCenter;
    const _bs = BOARDSCALE;

    _bc.x = _ds.TopWidth + (_bs.CENTER.x * _ds.unitSize);
    _bc.y = _ds.TopHeight + (_bs.CENTER.y * _ds.unitSize);

    let _icp = LOCALBOARDPOSITION.InnerCircleCenterPosition;
    const _ir = INNERCIRCLE_RAD;
    const _cos = Math.cos;
    const _sin = Math.sin;

    const _tmpIPOS = _icp.map((v,i,a)=>{
        return {
            "x":_bc.x + (_cos(_ir[i])*_bs.InnerCircleRadius*_ds.unitSize),
            "y":_bc.y + (-1*_sin(_ir[i])*_bs.InnerCircleRadius*_ds.unitSize)
        }
    });

    LOCALBOARDPOSITION.InnerCircleCenterPosition = _tmpIPOS;
    _icp = LOCALBOARDPOSITION.InnerCircleCenterPosition;
    
    let _tmpOrbPostions = ORBPOSITIONS[0].map((v,i,a)=>{
        return {
            "x":_bc.x + (_cos(_ir[i])*(_bs.InnerCircleRadius - _bs.OrbPositionCircleRadius) * _ds.unitSize),
            "y":_bc.y + (-1*_sin(_ir[i])*(_bs.InnerCircleRadius - _bs.OrbPositionCircleRadius) * _ds.unitSize)
        }
    })

    ORBPOSITIONS[0] = _tmpOrbPostions;

    const _or = OUTERPOSITIONCICLE_RAD;

    _tmpOrbPostions = ORBPOSITIONS[1].map((v,i,a)=>{
        return {
            "x":_icp[i].x + (_cos(_or[i][0])* _bs.OrbPositionCircleRadius * _ds.unitSize),
            "y":_icp[i].y + (-1*_sin(_or[i][0])* _bs.OrbPositionCircleRadius * _ds.unitSize)
        }
    })

    ORBPOSITIONS[1] = _tmpOrbPostions;

    _tmpOrbPostions = ORBPOSITIONS[2].map((v,i,a)=>{
        return {
            "x":_icp[i].x + (_cos(_or[i][1])* _bs.OrbPositionCircleRadius * _ds.unitSize),
            "y":_icp[i].y + (-1*_sin(_or[i][1])* _bs.OrbPositionCircleRadius * _ds.unitSize)
        }
    })

    ORBPOSITIONS[2] = _tmpOrbPostions;

    ORB_INITIALPOSITIONS = ORBPOSITIONS.map((arr)=>arr.slice());
}